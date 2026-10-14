---
title: "Pourquoi nous avons construit notre propre API HTML-to-PDF"
slug: pourquoi-nous-avons-construit-notre-propre-api-html-to-pdf
date: 2026-01-29
author: "Nicolas Rouanne"
---

**Auteur :** Nicolas Rouanne

**Date :** 29 janvier 2026

---

Chez Qraft, nous avons deux produits qui génèrent beaucoup de PDF : Billi, une plateforme SaaS de facturation pour les cabinets de freelances, et Embarq, une société de portage salarial entièrement automatisée. Entre les deux, on génère des factures, des comptes rendus d'activité, des notes de frais, des avoirs, des devis, des contrats et des simulations de paie. Les PDF sont partout.

Pendant des années, on a généré ces documents avec la même stack dans les deux produits. Ça marchait, mais c'était jamais génial. Je veux expliquer pourquoi on a décidé de construire une API dédiée de conversion HTML vers PDF plutôt que de continuer à rafistoler ce qu'on avait.

## Le setup : Grover, Rails et Sidekiq

Billi et Embarq sont des applications Rails. Pour la génération de PDF, les deux utilisent Grover, un gem Ruby qui encapsule Puppeteer (qui lui-même encapsule Chromium en mode headless). Le flux ressemble à ça :

1. Un job en arrière-plan (Sidekiq) prend en charge une tâche de génération PDF
2. Rails rend un template ERB en chaîne HTML
3. Grover convertit les URLs relatives en absolues
4. Grover lance une instance Chrome headless et convertit le HTML en PDF
5. Le blob PDF résultant est stocké dans ActiveStorage (S3)

Chaque produit a son propre ensemble de classes de service, de templates, de feuilles de style et de jobs. Dans Billi, il y a un concern `Pdfable` avec une machine à états (`draft` -> `generating` -> `generated`). Dans Embarq, un pattern similaire avec sa propre hiérarchie de classes `Pdf::Base`.

## Ce qui n'allait pas

**Le même problème, résolu deux fois.** Les deux produits ont essentiellement le même pipeline PDF : HTML en entrée, PDF en sortie, stockage. Mais comme la logique PDF est profondément intégrée dans chaque app Rails, on maintient deux implémentations parallèles. Deux configurations Grover. Deux sessions de débogage CSS. Deux Dockerfiles avec les dépendances système de Chromium.

**Chromium est un cauchemar à déployer.** À chaque mise à jour d'image de base, quelque chose casse. Grover a besoin de Node.js, Puppeteer et des bibliothèques système de Chromium (GTK, NSS, ALSA, et plus). Sur les Macs Apple Silicon, les développeurs tombent sur `spawn Unknown system error -86` et doivent trouver des contournements. La chaîne de dépendances est fragile et ajoute de la complexité à chaque pipeline CI/CD.

**Pas de réutilisation du navigateur.** Grover crée une nouvelle instance Chrome headless pour chaque PDF. À l'échelle, ça signifie lancer et détruire un processus navigateur complet pour chaque facture. C'est lent et gourmand en mémoire. Pas de pooling, pas de réutilisation.

**Le CSS et la pagination sont douloureux.** On a passé plus de temps que je ne voudrais l'admettre à débugger des propriétés `break-inside`, des sauts de page et la fragilité des layouts. L'historique git raconte l'histoire : commit après commit de "review invoice pdf layout", "PDF Company invoice rework", "Adding break-inside properties". Chaque modification de template risque de casser le rendu PDF de manière subtile, et il n'y a pas de boucle de feedback rapide.

**De l'asynchrone quand on n'en a pas besoin.** L'approche basée sur Sidekiq fait que les PDF sont générés en arrière-plan et stockés. Mais souvent, ce qu'on veut vraiment c'est : envoyer du HTML, recevoir un PDF, terminé. Le modèle asynchrone ajoute de la gestion d'état, de la logique de retry et du coût de stockage pour quelque chose qui pourrait être un simple appel HTTP synchrone.

## Ce dont on avait vraiment besoin

Quand j'ai pris du recul pour regarder le problème, ce dont on avait vraiment besoin était simple :

- **Un seul service** qui convertit du HTML en PDF, partagé entre les produits
- **Réponse synchrone** — envoyer du HTML, recevoir un PDF immédiatement
- **Réutilisation du navigateur** — une seule instance Chromium, un nouveau contexte par requête
- **Pas de dépendance à Rails** — n'importe quel produit, n'importe quel langage peut l'appeler
- **Déploiement simple** — un conteneur, un processus

C'est tout. Pas de machine à états, pas d'ActiveStorage, pas de jobs en arrière-plan. Juste un endpoint HTTP.

## La décision

On a décidé de construire une API standalone de conversion HTML-to-PDF. Un petit service ciblé qui fait une seule chose bien. Billi et Embarq peuvent l'appeler en HTTP, et tout futur produit aussi.

Ceci est le premier article d'une série. Dans les prochains, je couvrirai les choix techniques qu'on a faits (Playwright plutôt que Puppeteer, TypeScript, Hono) et comment on a conçu l'API elle-même.

## Ce qu'il faut retenir

Si vous avez de la logique de génération PDF dupliquée dans plusieurs apps, et que vous vous battez avec les dépendances Chromium et les problèmes de pagination CSS, extraire tout ça dans un service dédié vaut peut-être le coup. Ce n'est pas une décision architecturale complexe — c'est juste sortir de l'infrastructure partagée du code applicatif.

Le plus dur n'a pas été de construire le nouveau service. C'a été d'admettre que l'approche existante, qui marchait "assez bien" depuis des années, nous coûtait plus qu'on ne le réalisait en temps de maintenance et en frustration des développeurs.
