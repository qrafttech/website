---
title: "Remplacer du texte dans un PDF sans que ça se voit"
slug: remplacer-du-texte-dans-un-pdf-sans-que-ca-se-voit
date: 2026-06-12
author: "Nicolas Rouanne"
---

Je voulais corriger un libellé dans un PDF généré — remplacer `Heures pleines / Heures creuses` par `Heures forfaitaires`. Cinq minutes, je pensais. C'est devenu une plongée dans le fonctionnement intime des polices PDF, et une bonne leçon sur la différence entre « ça a l'air bon » et « c'est bon ». Le script qui en est sorti tient dans un fichier ; le chemin pour y arriver, beaucoup moins.

Tout repose sur [PyMuPDF](https://pymupdf.readthedocs.io/) (`fitz`), les liaisons Python de [MuPDF](https://mupdf.com/), qui fait à la fois le rendu, l'extraction de texte, la rédaction et l'édition bas niveau du flux de contenu.

## 1. Rédiger, pas recouvrir

Le réflexe naïf — dessiner un rectangle blanc par-dessus le texte — ne supprime rien : les glyphes restent dans le flux, récupérables au copier-coller ou avec `pdftotext`. PyMuPDF propose une vraie [rédaction](https://pymupdf.readthedocs.io/en/latest/page.html#Page.add_redact_annot) qui retire les glyphes du flux de contenu.

```python
page.add_redact_annot(rect, fill=bg)
page.apply_redactions()
```

Le piège : le remplissage de la rédaction est blanc par défaut. Sur une barre latérale beige, ça laisse un rectangle pâle. On échantillonne donc la couleur de fond juste à côté du texte avant de rédiger — à gauche, sinon à droite, sinon au-dessus :

```python
def sample_background(page, rect, dpi=144):
    candidates = (
        fitz.Rect(rect.x0 - 6, rect.y0, rect.x0 - 2, rect.y1),
        fitz.Rect(rect.x1 + 2, rect.y0, rect.x1 + 6, rect.y1),
        fitz.Rect(rect.x0, rect.y0 - 6, rect.x1, rect.y0 - 2),
    )
    for clip in candidates:
        clip = clip & page.rect
        if clip.is_empty or clip.width < 1 or clip.height < 1:
            continue
        pix = page.get_pixmap(dpi=dpi, clip=clip)
        r, g, b = pix.pixel(pix.width // 2, pix.height // 2)[:3]
        return (r / 255, g / 255, b / 255)
    return (1, 1, 1)
```

Détail bête, mais c'est ce genre de détail qui sépare « propre » de « bricolé ». À ce stade le texte est remplacé et le fond invisible. J'aurais pu m'arrêter là. C'est la police qui a tout fait basculer.

→ [apply_redactions](https://pymupdf.readthedocs.io/en/latest/page.html#Page.apply_redactions)

## 2. Matcher comme grep, pas comme une recherche plein-texte

`page.search_for` ([doc](https://pymupdf.readthedocs.io/en/latest/page.html#Page.search_for)) matche à travers les retours à la ligne et renvoie des rectangles partiels. Pour un comportement type `grep -F` — chaque ligne du motif sur une seule ligne du PDF, lignes consécutives verticalement adjacentes et dans la même colonne — on filtre sur la géométrie :

```python
candidates = [
    (t, b)
    for t, b in lines
    if needle in t
    and b.y0 > prev_bbox.y1 - 2                        # below the previous line
    and b.y0 - prev_bbox.y1 < prev_bbox.height * 1.5   # adjacent
    and b.x1 > prev_bbox.x0 and b.x0 < prev_bbox.x1    # same column
]
```

Ça évite qu'un libellé qui revient ailleurs dans la page, coupé différemment, parasite le remplacement.

## 3. Le terrier : des polices sans nom

Capturer la taille, la couleur et la ligne de base d'un span est trivial avec [`get_text("dict")`](https://pymupdf.readthedocs.io/en/latest/textpage.html). La police, c'est une autre histoire. Le PDF venait d'une page web imprimée — ses métadonnées disent `producer: Skia/PDF`, `creator: Chromium`. Et `page.get_fonts()` renvoie souvent :

```text
(7, 'n/a', 'Type3', '', 'F7', '', 0)
```

Une police **Type3** : les glyphes sont des dessins vectoriels embarqués directement dans le PDF, sans fichier de police, sans nom, sans drapeau de graisse. Pour le code, un libellé manifestement gras et du texte courant normal sont… identiques (`flags = 0` pour les deux).

Faute de métadonnée, on **mesure l'encre**. On rend le texte à fort zoom et on prend le 25e centile des longueurs de segments noirs horizontaux — une approximation de l'épaisseur de fût vertical, en em :

```python
def stem_from_pixmap(pix, fontsize, zoom):
    runs = []
    for y in range(pix.height):
        run = 0
        for x in range(pix.width):
            if sum(pix.pixel(x, y)[:3]) < 240:
                run += 1
            elif run:
                runs.append(run)
                run = 0
        if run:
            runs.append(run)
    if not runs:
        return 0.0
    runs.sort()
    return runs[len(runs) // 4] / (zoom * fontsize)
```

La calibration sépare proprement le régulier (≈ 0.083 em) du gras (0.125 em). Mais ça ne dit toujours pas **quelle** police utiliser pour réinsérer.

## 4. Retrouver la vraie police

L'indice était dans les métadonnées : `Skia/Chromium`, c'est une page web. Donc les polices du PDF sont celles du **site** de l'émetteur. Un `curl` suffit à les lister :

```bash
curl -sL https://exemple.fr | grep -oiE '[a-z0-9_/.-]+\.(woff2?|ttf|otf)' | sort -u
```

Les `.ttf` se téléchargent directement, et PyMuPDF les charge via [`fitz.Font(fontfile=…)`](https://pymupdf.readthedocs.io/en/latest/font.html). Je me suis dit : c'est plié. Ça ne l'était pas. Le projet est devenu intéressant parce que je me suis trompé trois fois de suite, en annonçant à chaque fois que c'était « indiscernable ».

## 5. L'espacement : Chromium quantifie au pixel

Première erreur : même avec le bon fichier, le rythme des lettres dérivait le long de la ligne. En comparant les avances caractère par caractère, la cause saute aux yeux : Chromium **arrondit chaque avance au pixel CSS entier** (à 9 pt, 1 em = 12 px). Le « T » du PDF fait 4.50 pt là où la police en donne 5.39.

Aucun fichier de police ne reproduit ça. Il faut ré-utiliser les avances **observées** dans le PDF, via [`get_text("rawdict")`](https://pymupdf.readthedocs.io/en/latest/textpage.html) qui descend au caractère :

```python
def harvest_advances(page, caches):
    if "advances" not in caches:
        adv = {}
        for block in page.get_text("rawdict")["blocks"]:
            for line in block.get("lines", []):
                for span in line["spans"]:
                    fname, size = span["font"], round(span["size"], 1)
                    chars = span["chars"]
                    for i in range(len(chars) - 1):
                        d = chars[i + 1]["origin"][0] - chars[i]["origin"][0]
                        if d > 0:
                            adv.setdefault((fname, size, chars[i]["c"]), d)
        caches["advances"] = adv
    return caches["advances"]
```

Pour un caractère absent de la page (introduit par le remplacement), on arrondit l'avance de la police à la grille de pixels détectée — exactement ce qu'aurait fait le générateur. À l'insertion, on positionne donc chaque glyphe à la main.

## 6. Le faux gras : réécrire la largeur de trait dans le flux

Deuxième erreur, la plus retorse. Le bloc gras mesurait 0.125 em de fût. Or aucune graisse réelle de la famille n'y tombait : Regular 0.083, Medium 0.111, Bold 0.139. La raison : Chromium n'avait pas de fichier « bold » pour cette police, alors il **trace un contour** autour du Regular (le faux gras CSS). Largeurs du Regular, fûts épaissis — irreproductible avec un fichier de police.

PyMuPDF sait stroker le texte ([`render_mode=2`](https://pymupdf.readthedocs.io/en/latest/textwriter.html#TextWriter.write_text), l'opérateur `Tr` du PDF), mais l'épaisseur de trait n'est pas exposée par l'API : `write_text` code en dur `0.05 × fontsize`. En inspectant le flux émis, on voit l'opérateur de largeur de ligne :

```text
q
0 0 0 RG
0 0 0 rg
BT
2 Tr
.45 w        ← largeur de trait, en dur
/F0 9 Tf
1 0 0 1 2 10 Tm
[<00170012...>]TJ
ET
Q
```

La solution : laisser `write_text` écrire son flux, puis **réécrire ce .45 w** avec une largeur calibrée sur l'écart de fût mesuré. Un trait de largeur `w` épaissit le fût de ~`w` ; on vise donc `(fût_cible − fût_plein) × corps` :

```python
if stroke_w:
    tw.write_text(page, color=color, render_mode=2)
    xref = page.get_contents()[-1]
    stream = doc.xref_stream(xref)
    stream = re.sub(rb"[0-9.]+ w",
                    (f"{stroke_w:.4f} w").encode(), stream, count=1)
    doc.update_stream(xref, stream)
```

Calibration : `0.375 pt` de trait → 0.125 em de fût, pile la cible. Une seule passe (couche texte propre, copier-coller correct), épaisseur exacte. L'accès bas niveau au flux — [`xref_stream`](https://pymupdf.readthedocs.io/en/latest/document.html#Document.xref_stream) / [`update_stream`](https://pymupdf.readthedocs.io/en/latest/document.html#Document.update_stream) — est ce qui rend le truc possible.

## 7. Ce qui a mis fin aux allers-retours

La vraie leçon n'est pas technique : **mon œil était un mauvais juge.** « Ça a l'air bon » a été faux trois fois de suite.

Ce qui a tout débloqué, c'est d'arrêter de regarder et de **mesurer**. Remplacer le texte **par lui-même**, puis superposer l'original et la sortie en fausses couleurs — encre d'origine sur un canal, nouvelle encre sur l'autre. Tout ce qui n'est pas vert est un écart.

```python
from PIL import Image
a = orig_page.get_pixmap(dpi=500, clip=zone)
b = new_page.get_pixmap(dpi=500, clip=zone)
ia = Image.frombytes('RGB', (a.width, a.height), a.samples).convert('L')
ib = Image.frombytes('RGB', (b.width, b.height), b.samples).convert('L')
# canal rouge = nouveau, canal bleu = original, vert = vide
Image.merge('RGB', (ib, Image.new('L', ib.size, 255), ia)).save('diff.png')
```

Couplé à la mesure de fût par zone, ça donne un critère chiffré (0.0952 vs 0.0952, 0.125 vs 0.139) au lieu d'une impression. C'est ce contrôle qui a révélé, zone par zone, que l'en-tête et la barre latérale étaient déjà parfaits mais que le bloc gras débordait — pas « ça a l'air épais », non : un nombre, faux. Une fois le critère en place, corriger devient mécanique.

→ [Pillow](https://pillow.readthedocs.io/), [Pixmap.samples](https://pymupdf.readthedocs.io/en/latest/pixmap.html#Pixmap.samples)

## 8. Empaqueter : un script uv sans installation

Tout tient dans un fichier exécutable, grâce aux [scripts uv](https://docs.astral.sh/uv/guides/scripts/) et aux métadonnées inline [PEP 723](https://peps.python.org/pep-0723/) :

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["pymupdf"]
# ///
```

Le shebang lance `uv run`, qui résout et installe PyMuPDF dans un environnement éphémère à la première exécution. `./pdf_replace.py …` et c'est parti, zéro `pip install`, zéro virtualenv à gérer.

## Ce qui reste

- **Polices requises.** Sans les `.ttf`/`.otf` de la famille, on retombe sur une base-14 (Helvetica & co) : proche, pas identique. La détection de Chromium/Skia aide à les retrouver, mais certains sites obfusquent leurs polices.
- **Styles mélangés sur une ligne.** Le span de plus grand recouvrement l'emporte pour toute la ligne ; pas de découpe intra-ligne.
- **Mesure de fût bruitée.** Le 25e centile est sensible au contenu (capitales vs minuscules) et à la taille ; les seuils sont calibrés, pas universels.
- **Pas d'OCR.** Le texte doit exister dans la couche texte.
- **Validé sur du Chromium/Skia mono-page.** D'autres générateurs quantifient différemment, voire pas du tout.

Ce que je retiens surtout : sur un problème visuel, **construis ton juge avant de juger**. La superposition en fausses couleurs a fait en une commande ce que mon œil ratait depuis trois itérations.

## Tous les liens

- PyMuPDF : [https://pymupdf.readthedocs.io/](https://pymupdf.readthedocs.io/)
- TextWriter : [https://pymupdf.readthedocs.io/en/latest/textwriter.html](https://pymupdf.readthedocs.io/en/latest/textwriter.html)
- Rédaction : [https://pymupdf.readthedocs.io/en/latest/page.html#Page.add_redact_annot](https://pymupdf.readthedocs.io/en/latest/page.html#Page.add_redact_annot)
- MuPDF : [https://mupdf.com/](https://mupdf.com/)
- uv (scripts) : [https://docs.astral.sh/uv/guides/scripts/](https://docs.astral.sh/uv/guides/scripts/)
- PEP 723 : [https://peps.python.org/pep-0723/](https://peps.python.org/pep-0723/)
- Pillow : [https://pillow.readthedocs.io/](https://pillow.readthedocs.io/)
- Skia : [https://skia.org/](https://skia.org/)
- Code source (gist) : [https://gist.github.com/nicolasrouanne/a4eabaa146dc9709f1a0c5568b552076](https://gist.github.com/nicolasrouanne/a4eabaa146dc9709f1a0c5568b552076)
