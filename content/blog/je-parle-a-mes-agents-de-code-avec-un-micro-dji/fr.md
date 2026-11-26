---
title: "Je parle à mes agents de code avec un micro DJI"
slug: je-parle-a-mes-agents-de-code-avec-un-micro-dji
date: 2026-12-24
author: "Nicolas Rouanne"
cover: "cover.jpg"
social: "social.jpg"
excerpt: "Je ne tape presque plus : je dicte à mes agents de code toute la journée, avec un petit micro sans fil sur le col. Mes messages sont plus longs et plus riches, les noms propres arrivent déformés, et mon méta-agent a dû apprendre à attendre mon feu vert."
---

Le 25 novembre au soir, j'ai envoyé ce message à Poulpito, le [méta-agent qui pilote mes autres agents de code](/blog/un-meta-agent-pour-piloter-mes-agents-de-code). C'est la transcription brute :

> J'ai fini parce que c'était en cours sur Hot Greenfield, est-ce que tu peux supprimer le Word Tricourt et en recrée un pour supprimer tous les commentaires comme j'avais fait dans une paire, tu reprends l'esprit de cette paire pour savoir quel commentaire il faut supprimer ou pas et un deuxième Wrice ça Khadi bien les deux ensemble pour pour mettre tous les schémas d'architecture que je t'ai déjà partagé qui sont notamment dans l'article de blog sur le Red faire un propre mettre le voilà et après on va faire un troisième tri pour déployer tout ça sur quelque part, je sais pas moi, j'imagine Claude Flöhr mais je pas très facile, j'en sais rien ça c'est moins c'est moins prioritaire

Je ne l'ai pas tapé, je l'ai dit. « Hot Greenfield », c'est auth-greenfield, le repo de notre exploration sur le SSO. « Word Tricourt », c'est un worktree, « une paire », une PR, et « Claude Flöhr », Cloudflare. Poulpito a pourtant tout compris : il a supprimé l'ancien worktree, lancé un agent pour retirer les commentaires du code dans l'esprit de la PR en question, un deuxième pour refaire la doc avec les schémas de [l'article sur le SSO](/blog/construire-un-serveur-sso-propre-en-rails), et noté le déploiement, « peut-être sur Cloudflare », pour plus tard.

C'est à peu près comme ça que je travaille maintenant : je ne tape presque plus, je parle à mes agents toute la journée.

## Pourquoi la voix

Ce que je dis à mes agents, c'est rarement du code. C'est une intention (supprime ce worktree, recrée-en un), du contexte (comme dans telle PR), un ordre de priorité (le déploiement, ça peut attendre), et beaucoup de retours sur le ton de ce qu'ils écrivent. Tout ça, je le dis bien plus vite que je ne le tape, et je peux le dire en marchant, loin du clavier.

## Le matériel

Le micro, c'est un DJI Mic Mini 2. L'émetteur se met sous la chemise, contre le col :

![L'émetteur DJI, blanc et translucide, glissé sous le col d'une chemise en jean](micro-sous-la-chemise.jpg "L'émetteur, sous la chemise")

Un aimant, de l'autre côté du tissu, le tient en place. De l'extérieur, on ne voit qu'un petit carré noir :

![Un petit aimant noir avec le logo DJI sur le col de la chemise](micro-aimant.jpg "De l'extérieur, il ne reste que l'aimant qui le tient")

Le récepteur se branche directement sur le port USB-C du MacBook, et le Mac le voit comme un micro :

![Le récepteur DJI translucide branché sur le port USB-C d'un MacBook, posé sur une table en bois](recepteur-usb-c.jpg "Le récepteur, sur le port USB-C du MacBook")

La dictée, c'est [Wispr Flow](https://wisprflow.ai) : je garde une touche enfoncée, je parle, je lâche, et le texte s'écrit là où est le curseur. Chez moi, c'est presque toujours le champ de chat d'Orca, l'app dans laquelle tournent mes agents. La touche, c'est celle du micro sur le clavier du Mac. macOS la garde pour sa propre dictée, et Wispr ne peut pas la prendre comme raccourci. Je la remappe donc sur F5 à chaque ouverture de session, avec un LaunchAgent qui lance `hidutil` :

```xml
<key>ProgramArguments</key>
<array>
    <string>/usr/bin/hidutil</string>
    <string>property</string>
    <string>--set</string>
    <string>{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0xC000000CF,"HIDKeyboardModifierMappingDst":0x70000003E}]}</string>
</array>
<key>RunAtLoad</key>
<true/>
```

Les remappages de `hidutil` ne vivent qu'en mémoire et disparaissent au redémarrage, d'où le `RunAtLoad`. Wispr voit alors un simple F5.

## Des messages plus longs, moins rangés

Avec un méta-agent, je ne parle qu'à un seul agent, et la voix s'y prête bien : je n'ai pas à choisir l'onglet du bon projet, je dis tout à Poulpito et c'est lui qui répartit. Mes messages sont devenus plus longs et plus riches. Celui du début contient trois tâches, leur ordre, une PR à prendre comme modèle, l'article où trouver les schémas et une hésitation sur l'hébergement. Je n'aurais jamais tapé tout ça d'une traite.

Ils sont aussi moins structurés : pas de liste, des phrases qui repartent au milieu, des « voilà ». C'est l'agent qui remet de l'ordre, et sa réponse me sert de relecture. Voilà celle que j'ai eue ce soir-là :

> C'est lancé dans auth-greenfield :
>
> - **L'ancien worktree est supprimé.** Il était propre et tout était déjà dans main.
> - **Agent 1, les commentaires** : il reprend les règles de ta PR 1 (tout retirer sauf les shebangs, `schema.rb` et ce dont un outil a besoin). […]
> - **Agent 2, la doc et les schémas** : un README propre et une `architecture.md` à jour. Il remplace les vieux schémas par ceux de l'article SSO […]
>
> **Le déploiement**, peut-être sur Cloudflare, est noté sur la tâche auth-greenfield. On le lance quand les deux PR seront mergées.

Si une ligne ne correspond pas à ce que j'ai voulu dire, je le vois tout de suite.

## Les noms propres

Ce que la transcription rate le plus, ce sont les noms propres, et ce sont justement ceux qui comptent : les noms de mes projets. Deux autres, le lendemain matin :

- « est-ce que tu peux review Épistole ? On reprend les deux reviews de perles » : Episto, un de nos clients, et ses deux PRs en cours de review ;
- « la Canard Racing Engineering » : Jacanda Racing, mon projet de voile.

Chaque fois, Poulpito a deviné juste, parce qu'il connaît mes projets et que le reste de la phrase l'aide. « Review » et « perles » à côté d'un mot qui ressemble à Episto, ça ne laisse pas beaucoup de doute.

## Quand il devine mal

Le vrai risque, ce n'est pas le nom déformé. C'est qu'à l'oral je réfléchis à voix haute, et qu'une réflexion ressemble beaucoup à une consigne. Le 26 au matin, on parlait d'une petite page interne pour suivre la sortie de nos articles. Je lui avais dit « on en parle d'abord », il m'avait proposé deux façons de l'héberger, et j'ai répondu « GitHub Actions et Cloudflare ». Pour moi, c'était une réponse dans la discussion. Pour Poulpito, c'était le feu vert : douze secondes plus tard, le repo existait sur GitHub, avec un nom que je n'avais pas encore choisi. Je l'ai arrêté, et le repo a été renommé deux minutes plus tard.

Poulpito a noté la règle dans sa mémoire, avec la raison :

> When Nicolas thinks out loud ("la question, c'est...", "on en parle"), he is discussing, not instructing: I answer and wait for his go before creating anything. That day I created a GitHub repo while he was still choosing its name.

## Ce qui aiderait

Pour les noms propres, Wispr Flow a [un dictionnaire](https://docs.wisprflow.ai/articles/4052411709-teach-flow-your-words-with-the-dictionary) où on ajoute les mots qu'il doit reconnaître. Ma liste est courte, ce sont les noms de mes projets et le vocabulaire de mes journées : Episto, auth-greenfield, Jacanda, worktree, PR, Cloudflare.

Pour le reste, c'est à l'agent de dire quand il n'est pas sûr. Poulpito le fait déjà quand il note dans sa mémoire une consigne que j'ai dictée : il écrit « in my reading », pour que je sache que c'est sa lecture et que je la relise. Ce que je voudrais, c'est la même chose avant d'agir : quand il hésite sur ce que j'ai dit, une ligne « j'ai compris ça, je lance ? » plutôt qu'un repo créé.
