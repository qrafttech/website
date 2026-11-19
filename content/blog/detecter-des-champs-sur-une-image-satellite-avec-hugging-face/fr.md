---
title: "Détecter des champs sur une image satellite avec Hugging Face"
slug: detecter-des-champs-sur-une-image-satellite-avec-hugging-face
date: 2026-11-17
author: "Adrien"
tmba: true
video: "https://media.qraft.tech/tmba/detecter-des-champs-sur-une-image-satellite-avec-hugging-face-v2-fr.mp4"
excerpt: "Un modèle de 62 millions de paramètres, quinze jobs GPU en parallèle sur Hugging Face, 2,13 $ pour 1 500 km² de cartes. Et un tour du Hub au passage."
---

Pour un client, Adrien devait dessiner les contours des champs cultivés sur un fond de carte satellite, puis repérer ceux qui sont irrigués. Il n'avait presque jamais utilisé Hugging Face. Le talk raconte comment il y est arrivé, et ce qu'il y a trouvé en chemin.

## Ce qui existait déjà, et pourquoi ça ne suffisait pas

Première piste : une base de données toute prête, Fields of The World, qui recense des milliards de champs sur la planète. L'intégration était idéale : le navigateur envoie des coordonnées, le serveur renvoie des tuiles avec les formes des champs et un indice de confiance.

Mais elle vient d'un modèle entraîné sur des images Sentinel-2 à 10 mètres de résolution, surtout en Europe. Sur les pays humides d'Afrique de l'Ouest qui nous intéressaient, il ne tient pas : avec un seuil de confiance de 69 %, toute la forêt devient un champ, et en le montant, il n'en reste presque plus.

Le modèle sur lequel repose cette base est excellent dans les benchmarks, à condition de lui donner des images à 3 mètres, la couche infrarouge et deux dates (en culture, puis récolté). Trois obstacles : ces images coûtent plusieurs dizaines de milliers de dollars rien que pour une preuve de concept, le volume explose à l'échelle d'un continent, et sa licence interdit l'usage commercial.

> [!TIP]
> Quand quelqu'un a déjà publié la solution, ça vaut le coup de creuser comment elle a été construite. Ici, la base était bonne là où le modèle avait des données, et seulement là.

## Delineate Anything

Le modèle retenu est un YOLO (*You Only Look Once*), une famille de modèles de détection de formes dans une image qui existe depuis 2015. Celui-ci a été réentraîné sur 73 millions de champs dans 61 pays, avec un dataset lui aussi publié sur Hugging Face. Il ne demande qu'une image, et renvoie directement des contours GeoJSON prêts à afficher sur la carte.

Le choix a été de lui donner la meilleure image possible : le fond de carte Esri, à 1 mètre de résolution. Les résultats sont nettement meilleurs, sans être parfaits : il rate encore des champs sans qu'on sache pourquoi. L'objectif n'était pas l'exactitude, mais de faire 80 % du travail avec l'IA et de laisser des humains corriger.

Le modèle arrive avec le script de ses auteurs : il découpe une image de n'importe quelle taille (ici 11 400 × 7 900 pixels) en vignettes de 512 pixels, gère le chevauchement, passe chaque vignette au modèle et recolle le tout. Adrien l'a repris tel quel.

## Où le faire tourner

Le modèle est léger : 125 Mo, 62 millions de paramètres, là où les grands modèles propriétaires en ont des centaines de milliards. « Il tourne sur un Mac » est vrai, mais ce n'est pas une raison de le faire tourner sur un Mac :

- **Sur le Mac** : 25 minutes pour une petite zone de démo, la machine à fond et inutilisable. Les cinq zones de 50 × 50 km du projet, soit 120 images, auraient pris environ 18 heures.
- **Sur un serveur** : un VPS sans GPU coûte une vingtaine d'euros par mois, un serveur avec une carte graphique dix fois plus, payé au mois pour un modèle qui tourne quelques heures.
- **Du GPU à l'heure** chez AWS, Google Cloud ou RunPod : possible, mais plus de mise en place.
- **Hugging Face Jobs**, retenu : du GPU à la minute, et autant de machines en parallèle que voulu.

Chaque job installe le script des auteurs et PyTorch sur une machine T4 small (un petit GPU Nvidia, le meilleur rapport qualité-prix), reçoit les coordonnées de ses images et la clé d'API Esri en secret, télécharge les tuiles, lance la détection et pousse le résultat dans un dataset Hugging Face, qui servait de base de données pendant la preuve de concept.

Les 120 images, réparties sur 15 jobs indépendants, ont pris 320 minutes de GPU au total, pour **2,13 $**.

Limite assumée : découper le travail en quinze laisse des champs mal recollés aux jonctions entre jobs. En production, mieux vaut un seul job plus long : la machine n'est pas chez nous, qu'elle tourne deux heures ou deux jours ne change pas grand-chose.

## Et les champs irrigués ?

Le contour des champs n'était que la première étape. Pour savoir si un champ est irrigué, on regarde douze mois en saison sèche, avec des données Google Earth :

1. la pluie : s'il ne pleut pas pendant des mois,
2. la verdure (NDVI) du champ, comparée à la médiane du paysage sans champ dans un rayon de 2 km,
3. l'évapotranspiration.

Un champ qui reste plus vert que son entourage sans pluie est probablement irrigué. C'est pour ça que la détection des contours était centrale : c'est elle qui sépare le champ de son environnement. Viennent ensuite les registres de propriété quand ils existent, et un agent qui cherche sur le web les exploitants et leurs contacts quand ils n'existent pas. Le prototype a été fait en quelques jours.

## Un détour par Sonnet

Adrien a aussi essayé la détection avec Sonnet. Il fait mieux que le modèle spécialisé, mais coûte environ 1 $ pour 10 km², contre 2 $ pour 1 500 km² : environ 75 fois plus cher. D'où une piste produit : une première passe avec le modèle spécialisé, et un nettoyage avec un grand modèle seulement là où quelqu'un le demande.

## Le reste du Hub

- **Les modèles**, filtrables par tâche (texte vers texte, image vers masque…) et par taille. Ils viennent rarement seuls : un script, une app ou une image Docker, souvent tirés du papier de recherche, montrent comment les lancer.
- **Les Inference Providers** : des hébergeurs qui font tourner un modèle ouvert pour vous et l'exposent en API, y compris des hébergeurs français, ce qui compte pour les clients qui posent la question de la souveraineté.
- **Les datasets** : pour entraîner, pour évaluer plusieurs modèles sur un même jeu de référence, ou simplement pour stocker des résultats.
- **Les Spaces** : des petites apps de démo pour tester un modèle avant de le télécharger, en déposant une image ou un fichier audio. Communautaires, donc de qualité très variable.

## Les questions de la salle

- **Open weights ou open source ?** Open weights, c'est le modèle seul : les ingrédients, pas la recette. Open source, c'est aussi les données et le protocole d'entraînement. Dans les deux cas, une licence dit ce qu'on a le droit d'en faire.
- **Un modèle chinois hébergé en France, ou un modèle français hébergé on ne sait où ?** La question est restée ouverte.
- **Faut-il 100 % d'exactitude ?** Pas pour de la prospection : le but est de donner des pistes à un commercial, pas un cadastre. Selon la culture, certains champs ne seront jamais détectés, et ce n'est pas grave.
