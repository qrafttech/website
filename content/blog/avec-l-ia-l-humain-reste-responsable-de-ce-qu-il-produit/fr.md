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

C'est la même chose pour le code. Une bonne partie de ce que je livre aujourd'hui, c'est Claude Code qui l'écrit : le code, mais aussi les descriptions de PR et les issues. C'est quand même mon nom dessus, et c'est à moi d'en répondre. Mon travail, c'est de relire l'axe, de challenger et de donner la direction.

Un exemple de la même semaine. Un check de CI bloquait les PR, et j'ai demandé à Claude d'ouvrir une issue. Sa première version faisait 304 mots : le constat, l'historique des trois PR qui y avaient mené, trois pistes et un paragraphe d'impact. Tout était juste. J'ai répondu « Plus simple ». La deuxième fait 122 mots : ce qui casse, pourquoi, et deux pistes.

![Une issue avant et après « Plus simple », anonymisée](issue.jpg "La même issue, avant et après « Plus simple »")

Ce qui est parti, c'est ce dont le lecteur n'avait pas besoin pour agir : l'historique, la troisième piste « si elle existe », l'impact qui redisait l'introduction. Ce tri, Claude ne l'a pas fait de lui-même, et c'est le même que pour les notes de comité de pilotage.

Pour le code, je relis d'abord la structure plutôt que le détail : les routes, les ressources, les noms. Si l'architecture doit changer, les bugs peuvent attendre. Et je ne réécris pas à la main, je dis où aller. Dans la même session, sur la façon de ne lancer que les checks utiles, ça donnait : « Je préfère que ça ne se lance pas du tout, plutôt que ça se lance et que ce soit ignoré ». C'est là qu'on a fini : le job lourd ne tourne pas du tout quand son projet n'a pas changé ([le détail dans un autre article](/blog/ne-lancer-que-les-tests-du-projet-modifie-sans-perdre-les-checks-requis)).

Cet article aussi a été écrit avec Claude. J'en ai refusé plusieurs versions avant celle-ci, et c'est mon nom qui est en haut.
