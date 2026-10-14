---
title: "Automatiser les feuilles de temps mensuelles depuis Toggl avec Claude Code"
slug: automatiser-les-feuilles-de-temps-mensuelles-depuis-toggl-avec-claude-code
date: 2026-03-04
author: "Nicolas Rouanne"
---

Je voulais générer une feuille de temps mensuelle depuis Toggl — une table montrant, jour par jour, combien de demi-journées j'ai travaillé pour chaque client. Simple en apparence. La partie délicate s'est révélée être l'arrondi.

## L'objectif

Le rendu voulu : un tableau où chaque ligne est un jour ouvré, chaque colonne est un client, et chaque cellule est une valeur en multiples de 0.5 jour. Une journée de travail vaut 5h30. Donc 4h chez un client et 2h chez un autre devrait donner `0.5 + 0.5 = 1.0 jour`, pas `1.0 + 0.5 = 1.5 jours`.

Les données viennent de l'API Toggl. Claude Code s'occupe de la récupération, de la correspondance entre les IDs de projets et les clients, et de l'exécution du script de calcul.

## Première tentative : report par client

L'approche naïve — arrondir les heures de chaque client indépendamment au 0.5 le plus proche — fait perdre des données. Un client avec 1h10m de suivi arrondit à 0 ce jour-là, et on ne récupère jamais ce temps.

La première correction essayée était un report par client : plutôt que d'arrondir chaque jour indépendamment, arrondir le _total cumulé_ par client. La fraction restante se reporte au jour suivant.

```python
def round_half(x):
    return math.floor(x * 2 + 0.5) / 2

for day in all_days:
    for client in all_clients:
        client_running[c] += raw_today[c]
        new_total = round_half(client_running[c])
        day_alloc[c] = new_total - client_assigned[c]
        client_assigned[c] = new_total
```

Ça fonctionne bien pour les totaux mensuels. Mais il y a un bug subtil quand plusieurs clients partagent une journée.

## Le problème : les totaux journaliers s'enflent

Le 5 février, j'ai suivi 7h42 réparties sur trois clients : Episto (4h34), Application mobile Santé (2h21) et Qraft (44m). Soit 1.40 vraie journée de travail.

Avec le report par client, chacun avait accumulé une dette des jours précédents, et tous les trois ont reçu un arrondi à la hausse le même jour :

| **Client** | **Brut du jour** | **Arrondi** |
| --- | --- | --- |
| Episto | 0.83j | 1.0 |
| Application mobile Santé | 0.43j | 0.5 |
| Qraft | 0.13j | 0.5 |
| **Total** | **1.40j** | **2.0** ❌ |

7h42 qui s'affiche comme 2 journées de travail, c'est faux. Les reports par client sont indépendants — ils ne se connaissent pas.

## La correction : report à deux niveaux

La solution consiste à faire tourner deux reports en parallèle.

**1. Report au niveau journée** — détermine combien de créneaux de 0.5 la journée mérite au total, en fonction des vraies heures travaillées :

```python
day_running += total_day_secs / DAY_SECS
day_value    = round_half(day_running) - day_assigned  # ex. 1.5 pour 7h42
slots        = int(day_value * 2)                       # ex. 3 créneaux
```

**2. Suivi de la dette client** — décide quels clients reçoivent les créneaux. Les clients avec le plus d'heures non compensées (total brut accumulé moins heures déjà créditées) ont la priorité :

```python
client_running[c] += raw_today[c]  # jamais arrondi

for _ in range(slots):
    best = max(active_clients, key=lambda c: client_running[c] - client_assigned[c])
    day_alloc[best] += 0.5
    client_assigned[best] += 0.5
```

Pour le 5 février avec 3 créneaux :

| **Client** | **Dette** | **Reçoit** |
| --- | --- | --- |
| Episto | la plus haute → créneaux 1 + 2 | **1.0** |
| Application mobile Santé | 2e → créneau 3 | **0.5** |
| Qraft | la plus basse | **0.0** |
| **Total** |  | **1.5** ✅ |

## Ce qui fonctionne

Les totaux journaliers sont maintenant bornés par les vraies heures travaillées. Une journée à 7h42 produit au maximum 1.5 jour. Les totaux mensuels convergent correctement — le suivi de la dette garantit qu'aucune heure n'est définitivement perdue, elles se décalent simplement au prochain jour où ce client a la dette la plus élevée.

## Le compromis

Les deux reports ne peuvent pas être parfaits simultanément. Si trois clients partagent une journée mais que celle-ci ne vaut que 1.0 créneau, un client ne reçoit rien ce jour-là même s'il a une dette significative. Ses heures se reportent au prochain jour où il apparaît.

En pratique sur un mois complet, l'erreur par client reste dans une plage de ±0.5 jour. C'est acceptable pour la facturation — c'est la même précision que des estimations manuelles en demi-journées.

## Ce qu'on en retire

Le script est un fichier Python autonome invoqué par une compétence Claude Code :

```bash
python3 ~/dev/claude/scripts/toggl_calendar.py 2026-01
python3 ~/dev/claude/scripts/toggl_calendar.py 2026-01 2026-02
```

La compétence gère aussi la classification des entrées sans tag, le plafonnement des timers lancés la nuit et la mise à jour en masse des projets via l'API Toggl — des choses que je faisais auparavant manuellement dans l'interface web de Toggl.

L'algorithme d'arrondi en lui-même fait une vingtaine de lignes. La partie intéressante, c'est de réaliser que l'arrondi est un problème à 2 dimensions quand on a plusieurs clients par jour, et non à 1 dimension.
