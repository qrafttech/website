---
title: "Alléger les specs RSpec"
slug: alleger-les-specs-rspec
date: 2026-12-07
author: "Nicolas Rouanne"
excerpt: "Paralléliser RSpec a réduit l'attente, pas le travail. Cinq conventions de specs font tourner la même suite 45 % plus vite, et une mesure a montré où était le vrai coût : la factory."
---

Chez un de nos clients, [paralléliser RSpec](/blog/paralleliser-rspec-sur-github-actions) a fait passer la CI d'une PR de 10 à moins de 5 minutes. Mais la suite fait toujours le même travail, juste réparti sur 6 processus. Pour qu'elle en fasse moins, il faut des specs qui en font moins.

Une PR a posé cinq conventions :

- un setup coûteux partagé par un seul exemple `:aggregate_failures` ;
- ne créer que les enregistrements testés ;
- des factories sans cascades d'enregistrements ;
- `build_stubbed` quand le spec ne lit jamais la base ;
- supprimer les exemples qui ne prouvent rien de plus que leur voisin.

![Durée de la suite sur la même machine : specs de main, de la PR, puis de main](conventions-fr.png "Les deux passes de main encadrent la mesure : 1 % d'écart entre elles.")

## Trop grosse pour être relue

La PR touchait 641 fichiers. On l'a fait auditer par des agents, en passes, jusqu'à ce qu'il ne reste rien :

![Problèmes confirmés à chaque passe d'audit](audit-fr.png "Chaque correction est vérifiée en cassant le code : le spec doit passer au rouge.")

La relecture humaine a quand même trouvé des tests verts pour une mauvaise raison : un user `build_stubbed` n'a pas de rôles, donc un refus d'accès passait toujours. Et une mesure a montré que `build_stubbed` n'était pas le vrai gain :

![Temps pour créer un user admin selon la méthode](factory-fr.png "La factory donnait un compte à chaque user, même aux admins qui n'en ont pas en production.")

## Une règle à la fois

On applique donc les conventions une règle à la fois : une PR par règle, relue en quelques minutes. Une règle vérifiable automatiquement devient une règle RuboCop ; les autres vont dans le knowledge des agents, en phrases simples. Et les users de test sont créés comme en production.

La parallélisation n'aura pas à changer : sur la suite allégée, le même bench donnait aussi 3 jobs de 2 processus.

> [!NOTE]
> Les runners `ubuntu-latest` tombent sur des CPU différents, et la même suite peut prendre de 477 à 730 s. Les versions de la suite sont donc comparées sur une seule machine, l'une après l'autre. On suit aussi dans PostHog la somme des temps de chaque fichier de spec, qui monte quand on ajoute des specs, pas quand on ajoute des jobs (voir [Suivre les OKR tech d'une équipe dans PostHog](/blog/suivre-les-okr-tech-d-une-equipe-dans-posthog-depuis-github-actions)).
