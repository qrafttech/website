---
title: "Dessiner chaque champ d'une carte avec un modèle IA"
slug: dessiner-chaque-champ-d-une-carte-avec-un-modele-ia
date: 2026-11-30
author: "Adrien Lupo"
cover: "cover.jpg"
excerpt: "Les bases de contours de champs existantes étaient trop imprécises : on a fait tourner Delineate Anything sur Hugging Face Jobs, 120 images pour 2,13 $."
---

Pour la [carte de prospection qu'on a construite pour un client](/blog/une-carte-pour-aider-des-commerciaux-a-trouver-les-champs-irrigues) qui vend du matériel d'irrigation, il fallait dessiner chaque champ agricole sur cinq zones de 50 × 50 km, au Sénégal et en Côte d'Ivoire. Cet article raconte la partie IA : comment on a choisi le modèle, comment on l'a fait tourner sur Hugging Face pour **2,13 $**, puis un tour de la plateforme.

## 1. Trois pistes pour dessiner les champs

Des bases de contours de champs existent déjà, mais sur nos zones elles étaient trop imprécises. On a regardé trois pistes avant d'en retenir une.

### Fields of The World, une base déjà calculée

[Fields of The World](https://fieldsofthe.world/) publie les contours de champs de toute la planète, déjà calculés : environ 1,6 milliard de champs par an, pour 2024 et 2025. Ils sont prédits sur des images Sentinel-2 à 10 m, par une équipe dont font partie Microsoft AI for Good et Taylor Geospatial. Les données sont sous licence CC-BY-4.0, en tuiles vectorielles PMTiles qu'on charge directement sur une carte.

C'est la première chose que j'ai essayée. Autour de N'Douci, en Côte d'Ivoire, avec un seuil de confiance à 69 %, il y a **beaucoup de faux positifs** : de grands aplats recouvrent la forêt et les plantations sans séparer les parcelles. Si on monte le seuil, **on perd beaucoup de vrais champs**. Et le bon réglage change d'une zone à l'autre.

![L'explorateur Fields of The World autour de N'Douci : de grands aplats colorés couvrent forêt et plantations sans séparer les parcelles.](fields-of-the-world-ndouci.jpg "Fields of The World autour de N'Douci (Côte d'Ivoire), prédictions 2025, seuil de confiance à 69 %.")

### Fields of the Planet, un modèle cher à faire tourner à l'échelle

La même équipe publie [Fields of the Planet](https://huggingface.co/fieldsoftheworld/ftp-b7), un modèle qu'on fait tourner soi-même : un U-Net de 270 Mo. Il prend deux images PlanetScope à 3 m de la même zone, avec le proche infrarouge, une au semis et une à la récolte. Il classe ensuite chaque pixel en fond, intérieur de champ ou bordure.

![Schéma du modèle Fields of the Planet : deux images avec infrarouge, au semis et à la récolte, entrent dans un U-Net de 270 Mo qui classe chaque pixel en fond, intérieur de champ ou bordure.](fields-of-the-planet-fr.png "Fields of the Planet : deux dates, l'infrarouge, une classe par pixel.")

Il bloque sur trois points. D'abord **le coût** : il faut les mêmes images qu'à l'entraînement, et c'est de l'imagerie Planet, payante. Ensuite **le passage à l'échelle** : les dates de semis et de récolte changent selon la culture, le pays et la région, il faudrait donc les choisir zone par zone pour couvrir un pays. Enfin **la licence**, CC-BY-NC-4.0, qui interdit l'usage commercial, donc un produit client comme celui-ci.

### Delineate Anything, une simple photo suffit

[Delineate Anything](https://huggingface.co/MykolaL/DelineateAnything) est **un modèle YOLO11 réentraîné pour délimiter des champs**. YOLO, pour *You Only Look Once*, est une famille de modèles de vision qui repère tous les objets d'une image en une seule passe, d'où leur rapidité. [YOLO11](https://docs.ultralytics.com/models/yolo11/) en est la version publiée par Ultralytics en septembre 2024. Elle sait détecter des objets, mais aussi tracer leur contour exact, ce qu'on appelle la segmentation d'instances. Delineate Anything en reprend la plus grosse variante, YOLO11x-seg, entraînée à reconnaître des champs plutôt que des voitures ou des piétons. **Chaque champ détecté devient un objet à part**, avec son propre contour.

![Schéma de Delineate Anything : une seule photo satellite ordinaire entre dans le modèle (YOLO, 125 Mo), chaque champ sort comme un objet séparé avec son contour vectoriel.](delineate-anything-fr.png "Delineate Anything : une photo, un objet par champ.")

Il lui faut **une photo couleur ordinaire, à une seule date**, avec une résolution entre 0,25 et 10 m. On l'utilise sur une photo satellite à environ 1 m. Il a été entraîné sur [FBIS-73M](https://huggingface.co/datasets/MykolaL/FBIS-73M) (licence MIT) : 1,48 million d'images et 74 millions de champs annotés dans 61 pays, là où le jeu de Fields of The World en couvre 24, dont 17 européens.

Il est sous licence AGPL-3.0, qui **autorise l'usage commercial**. La contrainte porte sur le code modifié servi à des utilisateurs par le réseau, qui doit alors être publié ; nous lançons le pipeline des auteurs sans en modifier le code, en batch. Et il est petit, environ 62 millions de paramètres pour 125 Mo de poids : **il tourne même sur un portable**.

## 2. L'implémentation

### Le pipeline des auteurs

Le [dépôt GitHub de Delineate Anything](https://github.com/Lavreniuk/Delineate-Anything) fournit un script, `delineate.py`, qui traite une grande image en quatre étapes. Il la découpe en vignettes de 512 px, les fait se chevaucher de moitié pour qu'un champ coupé au bord d'une vignette soit vu en entier dans la voisine, détecte les champs par lots sur le GPU, puis recolle le tout en une seule couche vectorielle. Il produit un GeoPackage, que je convertis en GeoJSON pour la carte.

![Les quatre étapes du pipeline Delineate Anything : découper en vignettes de 512 px, chevaucher de moitié, détecter par lots sur le GPU, recoller en une seule couche.](pipeline-delineate-fr.png "Le pipeline des auteurs, sur une image de 11 400 × 7 900 px : environ 770 contours.")

**Je ne touche pas au code de ce script.** Je le récupère à un commit fixé et je l'installe comme l'indique le README. Je change seulement deux réglages de sa configuration : le masque d'occupation du sol, pour lequel j'utilise [ESA WorldCover](https://esa-worldcover.org/), et la surface minimale d'un champ.

Une image couvre environ 13 × 9 km, il en faut donc 120 pour mes cinq zones, 24 par zone.

### Où faire tourner 120 images

J'ai comparé cinq options, à partir de mesures ou d'estimations tirées de nos mesures.

![Cinq façons de faire tourner le modèle sur 120 images : aucune API ne le sert, environ 18 h sur un Mac, 6 à 8 jours sur un serveur sans GPU, environ 4 à 5 $ sur un GPU à l'heure, 2,13 $ avec Hugging Face Jobs.](ou-faire-tourner-fr.png "Cinq options pour 120 images.")

Aucun fournisseur d'inférence ne sert ce modèle par API sur Hugging Face, donc cette option est exclue. Sur mon MacBook Pro M1 Pro, le pipeline utilise le GPU d'Apple et tourne environ deux fois moins vite que sur un T4 : il faudrait à peu près 18 heures de calcul sans interruption. Un VPS sans GPU à 20 € HT par mois mettrait 6 à 8 jours, et un serveur avec GPU coûte autour de 200 € par mois. Un GPU loué à l'heure chez AWS, Google Cloud ou RunPod reviendrait à 4 ou 5 $, mais il faut allumer la machine, l'installer, puis l'éteindre. J'ai choisi **Hugging Face Jobs, qui loue un GPU à la minute** et se lance par une simple requête.

### Hugging Face Jobs

Un [Job](https://huggingface.co/docs/hub/jobs), c'est une image Docker, une commande, un type de machine (le *flavor*) et des secrets. Hugging Face **démarre le conteneur, facture à la minute et l'arrête à la fin**. Pas besoin d'abonnement, un solde de crédits prépayés suffit.

![Schéma du run : depuis mon Mac, 15 Jobs Hugging Face lancés, 10 à la fois, chacun installe le pipeline puis traite 8 images, charge le modèle depuis le Hub et dépose le résultat dans un dataset privé. Au total, 320 minutes de GPU et 2,13 $.](hugging-face-jobs-fr.png "15 Jobs, 8 images chacun, 2,13 $ au total.")

Je lance les Jobs depuis un script, via l'API HTTP de Hugging Face ; la [CLI `hf`](https://huggingface.co/docs/huggingface_hub/guides/cli) permet la même chose en une commande. Chaque Job s'arrête au bout de 2 heures au plus.

Le flavor `t4-small`, c'est un GPU NVIDIA T4 de 16 Go, 4 vCPU et 15 Go de RAM, pour 0,40 $ de l'heure. L'installation du pipeline (conda, pip) prend environ 3 minutes : en groupant 8 images par Job, je ne la paie qu'une fois pour 8. **Mon Mac n'envoie aucune image**, seulement des coordonnées et des clés. Chaque Job récupère ses photos, lance `delineate.py`, dépose un fichier par image dans un dataset privé du Hub, puis efface ses fichiers. Si un Job plante, **seule l'image en cours est perdue**.

J'ai aussi mis un plafond : le script **ne lance aucun Job qui pourrait faire dépasser 10 $ au total**, et il vérifie d'abord, auprès de l'API de Hugging Face, que le prix du flavor n'a pas changé.

Sur les cinq zones, ça a donné **120 images, 15 Jobs dont 10 en parallèle, 320 minutes facturées, 2,13 $ et 92 098 contours**.

![La même photo satellite près de Saint-Louis, sans puis avec les contours de champs dessinés par Delineate Anything.](avant-apres.jpg)

Pour essayer le modèle sur une image sans rien installer, le README des auteurs renvoie vers une [démo sur un Space Hugging Face](https://huggingface.co/spaces/hugging-apps/delineate-anything-v2).

## 3. Hugging Face

Hugging Face est la plateforme où se partagent les modèles, les datasets et les démos d'IA ouverts. C'est là qu'on a trouvé Delineate Anything et qu'on l'a fait tourner. Les chiffres ci-dessous datent du 17 novembre 2026.

### 3 244 718 modèles

La [page des modèles](https://huggingface.co/models) se parcourt avec des filtres. Le schéma en montre cinq, avec la place de Delineate Anything dans chacun.

![Cinq filtres de la page des modèles : Tasks, Parameters, Libraries, Apps et Inference Providers, avec pour chacun la place de Delineate Anything.](filtres-du-hub-fr.png "Cinq filtres du Hub, et où se place Delineate Anything.")

Tasks dit ce que le modèle prend et rend, ici `image-segmentation`. Parameters donne sa taille : en 16 bits, un paramètre pèse 2 octets, donc 1B représente environ 2 Go de mémoire. Libraries indique le code qui charge les poids, ici `ultralytics`, au-dessus de PyTorch. Apps liste les logiciels pour le lancer sur sa machine, comme Ollama ou LM Studio, surtout pensés pour les LLM. Inference Providers recense les hébergeurs qui le servent par API. **Aucun ne sert Delineate Anything, d'où les Jobs.**

![La page de Delineate Anything sur Hugging Face : tâche Image Segmentation, bibliothèque ultralytics, licence AGPL-3.0, et aucun Inference Provider.](hf-modele.jpg)

Tous les modèles du Hub sont *open weight* : leurs poids se téléchargent. C'est **leur licence qui fixe ce qu'on a le droit d'en faire**, comme on l'a vu avec Fields of the Planet. Les modèles fermés comme GPT, Claude ou Gemini n'y sont pas, même si OpenAI y publie des modèles ouverts, les `gpt-oss`.

### 1 134 666 datasets

Un dataset est **un tableau d'exemples** : une entrée, et souvent la réponse attendue. On en croise trois usages dans ce projet. FBIS-73M a servi à entraîner Delineate Anything. Fields of The World sert de banc d'essai pour noter les modèles de délimitation, et Voxel51 en a mis [une copie sur le Hub](https://huggingface.co/datasets/Voxel51/fields-of-the-world). Enfin, nos résultats sont stockés dans un dataset privé, où chaque envoi d'un Job est un commit. On peut aussi s'en servir pour affiner un modèle existant avec ses propres exemples.

### 1 531 251 Spaces

Un Space est **une app web hébergée par Hugging Face**, le plus souvent la démo d'un modèle, comme celle de Delineate Anything. On le construit avec Gradio, Docker ou en HTML statique, et une app Gradio expose aussi une API. Le matériel CPU de base est gratuit, les GPU se louent à l'heure (0,40 $ pour un T4 small), et ZeroGPU prête un GPU partagé le temps d'un appel, avec un quota quotidien de quelques minutes. Créer un Space Gradio ou Docker demande en général le plan PRO, à 9 $ par mois. Le bouton « Duplicate this Space » crée une copie privée sous son compte.

![La démo Delineate Anything v2 sur un Space Hugging Face : une image Sentinel-2 à gauche, les champs délimités à droite.](space-demo.jpg)
