---
title: "Avec l'IA, l'humain reste responsable de ce qu'il produit"
slug: avec-l-ia-l-humain-reste-responsable-de-ce-qu-il-produit
date: 2026-11-16
author: "Nicolas Rouanne"
---

Fin octobre, dans une des boîtes avec qui on travaille, un membre de la direction a posté ce message à toute l'équipe.

![Message Slack d'un membre de la direction, noms masqués](message.jpg "« en produisant avec l'IA, on reste 100% responsable de la qualité produite »")

L'entreprise venait de lancer un plan « AI first », et sur certains sujets, la qualité avait baissé, au point d'en parler en réunion de managers. Un chiffre résume bien la chose : la longueur moyenne des notes de comité de pilotage a été multipliée par 4 en 3 mois.

Je l'ai relayé à l'équipe Qraft le lendemain matin, parce que je pense que ça nous concerne tous, avec ce que j'en pense :

> De mon côté, il est hors de question que je passe plus de temps à lire des choses qui ont été générées par l'IA et qui sont du slop à 10 000 mots quand l'auteur aurait pu faire plus simple / plus court / plus pertinent. Il est facile d'écrire, difficile de lire, le travail est à faire du côté de l'auteur.

## Quand je code

C'est la même chose pour le code. Une bonne partie de ce que je livre aujourd'hui, c'est Claude Code qui l'écrit. Mais c'est mon code : c'est mon nom sur la PR, et si ça casse, c'est à moi d'en répondre. Du coup, ma relecture suit à peu près toujours le même ordre.

D'abord l'axe. Avant de lire le détail, je regarde la structure : les routes, les ressources, les contrats, les noms. Si l'architecture doit changer, les bugs, on s'en fiche : corriger du code qui va être restructuré, c'est faire la relecture deux fois.

Ensuite, je challenge. Des questions courtes, une à la fois : « c'est quoi le builder ? », « pourquoi les 2 ? ». Et une que je pose presque à chaque PR : qu'est-ce qu'on aurait pu enlever ? Une abstraction « au cas où », une interface que personne n'utilise encore, un champ qui duplique une donnée qu'on a déjà, c'est ce qui passe le plus facilement quand on ne relit pas.

Puis je donne la direction. Je ne corrige pas ligne à ligne : je dis où aller, par exemple « cette route doit vivre sous la vraie ressource, pas dans un endpoint à part », et Claude refait. Les bugs viennent seulement après, une fois que la forme est la bonne.

Cet article aussi a été écrit avec Claude. J'en ai refusé deux versions avant celle-ci, et c'est mon nom qui est en haut.
