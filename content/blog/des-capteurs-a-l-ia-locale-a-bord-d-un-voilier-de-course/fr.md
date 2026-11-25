---
title: "Des capteurs à l'IA locale, à bord d'un voilier de course"
slug: des-capteurs-a-l-ia-locale-a-bord-d-un-voilier-de-course
date: 2026-11-24
author: "Adrien"
tmba: true
video: "https://media.qraft.tech/tmba/des-capteurs-a-l-ia-locale-a-bord-d-un-voilier-de-course-fr.mp4"
excerpt: "Une quarantaine de mesures par seconde, des logiciels Windows d'experts, une app au poignet écrite avec Claude, et un ordinateur avec GPU qui transcrit l'équipage sans réseau."
---

Adrien travaille depuis trois ans sur les systèmes d'un voilier de course en Méditerranée : 11 équipiers à bord, une équipe de 25 personnes qui tourne, 6 à 8 régates par an, de 50 à 60 jours de navigation. Le bateau sort peu, donc chaque sortie compte pour tester : en mer, rien ne se passe comme à quai.

Une seule personne à bord fait de la tech : le navigateur. Il passe la course sur une tablette durcie, à suivre où va le bateau, où sont les autres et s'il y a assez de fond pour passer. Le point de départ du talk : on a 11 cerveaux à bord, pourquoi un seul aurait accès aux chiffres ?

## Ce qu'il y a à bord

Le bateau ne fait que mesurer : aucun pilote automatique, aucun vérin, l'équipage fait tout. Ça simplifie beaucoup le travail, et ça laisse pousser loin l'analyse des données.

Les capteurs sont branchés sur un même câble qui traverse le bateau, un bus NMEA 2000 :

- en haut du mât, la force et l'angle du vent,
- un GPS, un gyroscope, la vitesse du bateau par rapport à l'eau,
- une sonde pour la profondeur,
- l'angle de la barre,
- des capteurs de charge dans le gréement, pour savoir comment le bateau est réglé.

Personne ne lit ces valeurs brutes. Deux centrales de navigation en tirent ce qui sert en voile : le vent réel, l'angle du bateau par rapport au vent, la vitesse de progression vers le vent. Elles contiennent aussi des tables de correction des capteurs et des cibles, la vitesse ou l'angle qu'on devrait tenir dans ces conditions. Autour, un routeur 5G, du Wi-Fi pour les téléphones et les tablettes, un Raspberry Pi pour développer, et un petit PC qui fait tourner les logiciels Windows, affichés en bureau à distance sur la tablette.

NMEA 2000 date des années 2000 et envoie une valeur par seconde. L'équipe en voudrait 10 à 20 fois plus. Un des calculateurs écoute le bus et republie les données sur le réseau IP, en WebSocket.

Et tout ça doit marcher sur un bateau qui avance à plus de 20 nœuds, mouillé, qui tape. À l'intérieur, pas de cabine, pas un coussin. Le navigateur reste dehors : il doit voir le plan d'eau et parler à l'équipage.

## Des logiciels précieux, sous Windows

La version de 2024, encore utilisée l'an dernier, c'était un vieux logiciel Windows aux boutons minuscules : avec de l'eau sur la tablette, ça clique partout. Le navigateur avait scotché des notes autour de l'écran.

Le même problème revient sur toute la chaîne. La navigation, l'analyse après la course et l'analyse de la forme des voiles ont chacune leur logiciel Windows, et leur format de fichier. Chaque logiciel ajoute sa couche de calculs sur des données censées être les mêmes. Après chaque sortie, il fallait une heure, une heure et demie à quelqu'un qui connaît les outils pour extraire les données : clés USB, licences sur dongle.

Mais ces logiciels sont écrits par des gens qui font de la voile depuis longtemps, et ils contiennent un savoir-faire que l'équipe ne saurait pas recréer. Le défi, c'est de moderniser sans perdre ça.

Il y a aussi le règlement. Pour l'immense majorité des courses, l'aide extérieure est interdite : pas d'information à laquelle les concurrents n'auraient pas accès. Internet à bord est toléré pour l'instant. Et au large, le débit est faible, voire nul.

## Trois moments à outiller

L'équipe sépare trois moments :

1. **avant la course** : préparer, pour que l'interface soit la plus simple possible ensuite, sachant que chaque course est différente ;
2. **pendant** : le plus dur, afficher la bonne information au bon moment (le départ, une manœuvre) sans que personne ait à toucher au système ;
3. **après** : analyser plus finement et comparer avec les sorties précédentes.

## Rendre le bateau accessible depuis le bureau

Premier obstacle : pour travailler sur les systèmes, il fallait être à bord, sur le réseau local. Le VPN du routeur était payant et marchait mal. L'équipe a fini par installer Tailscale sur le Raspberry Pi : depuis le bureau, on est sur le réseau du bateau.

À partir de là, avec Claude, les outils se refont vite. Les données partent aussi dans le cloud, pour que tout l'équipage y ait accès sans être sur le tailnet, et le tout continue de marcher en local à bord. Le premier tableau de bord Grafana ne montre que des données brutes, mais comparé à l'heure d'extraction après chaque sortie, c'est déjà un autre monde.

## Les chiffres au poignet

L'app pour montre Garmin a été écrite par un agent. Claude avait accès au SDK Garmin et à son simulateur, comme pour un simulateur iPhone : il le lançait en ligne de commande et prenait des captures d'écran. Il en a sorti des versions pour les différentes montres de l'équipage. L'app n'est pas publiée, la validation de Garmin ressemble à celle de l'App Store.

Elle affiche la vitesse, la cible, le pourcentage de la polaire, et la moyenne des oscillations du vent sur les 10 dernières minutes, pour dire au tacticien de quel côté du plan d'eau il a intérêt à aller. Elle lit les données sur le bateau s'il répond, sinon sur le serveur à terre : à bord, on ne veut pas dépendre du cloud, mais à terre, le reste de l'équipe veut suivre la course.

## Dire si le bateau va vite

L'app téléphone a un écran de performance et des écrans de manœuvre. C'est là que c'est difficile : il n'y a pas d'absolu. En régate, tous les bateaux sont différents, et chacun court avec un coefficient, comme un handicap au golf. On n'est pas classé à l'arrivée mais sur son temps corrigé. Sur une course de trois jours, il n'y a souvent aucun concurrent à côté pour se comparer, et l'écart se joue à 2 ou 5 % de vitesse.

La définition qui marche empiriquement pour l'instant : on prend tous les bords à la même allure et dans la même force de vent, par exemple autour de 10 nœuds, et on regarde si les 30 dernières secondes sont dans les 20 % les meilleurs de la journée.

Pour les manœuvres, les capteurs suffisent à détecter un virement ou un empannage. L'app prend la vitesse moyenne sur les 10 à 20 secondes avant, et mesure le temps qu'il faut pour revenir à 90 % de cette vitesse : le temps perdu, la distance perdue.

Adrien le dit lui-même : ce sont des versions débutantes de ces algorithmes. L'équipe travaille avec des professionnels de la voile, qui ne donnent pas tous leurs secrets.

## L'IA en local, à bord

La partie la plus récente : faire tourner des modèles d'IA à bord, avec une start-up qui vend de l'IA en edge, surtout pour des chaînes de production industrielles. C'est le travail en alternance d'Adrien : tester leur produit sur le bateau.

Côté matériel, c'est un ordinateur Nvidia avec un GPU. Ce que la start-up apporte, c'est le logiciel : les drivers, les connecteurs et une pile de déploiement d'applications, un peu comme si on posait sa pile AWS sur une machine. Aucun modèle n'est livré avec, c'est d'ailleurs un des retours que l'équipe leur a faits. La machine expose un serveur MCP : on y connecte Claude, et on peut monter très vite une app à partir des données que la centrale partage sur le réseau.

On développe avec Claude, puis la machine tourne déconnectée : le bateau peut perdre le réseau à tout moment au large, donc tout ce qui doit marcher en course tourne en local.

### Transcrire l'équipage

À bord, on parle sans arrêt. Un micro sans fil, porté sur le pont, est branché par son récepteur sur la machine. Un grand modèle Whisper transcrit, puis un modèle français remet chaque échange en contexte : est-ce qu'on est en pause, sous voile, en manœuvre ? L'app a été montée avec Claude, par le MCP, et déployée sur la machine en deux heures, téléchargement du modèle compris. Elle range la journée en manœuvres et en pauses, garde les extraits audio pour les réécouter, et dit même si la manœuvre était bonne ou pas.

Le premier essai a eu lieu pendant un week-end d'entraînement, deux jours avant le talk. Le premier jour, il pleuvait, 20 nœuds de vent (environ 40 km/h), le micro sous une veste : il a marché.

Le problème est venu du vocabulaire. À bord, on ne parle pas comme dans la rue : vocabulaire de la voile, phrases raccourcies pour parler le moins possible. La transcription s'est beaucoup trompée. L'équipe lui a donné le vocabulaire du bord, et maintenant elle le cherche partout : elle transcrit même du bruit en mots de voile. Les usines ont sûrement le même problème, avec leur propre langage.

### Pourquoi du contexte

Avec des données brutes seules, on ne sait pas ce qui se passe. On ne sait pas si on a viré vite à cause d'un concurrent ou d'un rocher, si on est lent parce qu'on navigue mal ou parce qu'on change de voile, ni qui barre. Or pour calibrer les capteurs ou établir les vitesses cibles, il faut trier les bonnes données des mauvaises. Sinon, soit on garde tout et on a beaucoup de bruit, soit on trie sans savoir comment, avec le risque de ne garder que les meilleurs moments.

Le but est d'agréger tout ça en un bilan de la journée. Les sources se recoupent : le micro entend qu'on a envoyé telle voile, la caméra la voit, les données le laissent deviner. Et de transformer les sensations en preuves : quand un équipier sent bien le bateau, est-ce que ça se voit dans la vitesse ? Le but n'est pas de remplacer l'équipage, mais de l'aider à progresser.

Ce travail se fait après la course pour l'instant, c'est trop lourd en direct. Tout ce qu'on arrive à automatiser après, avec de l'IA ou un algorithme, glisse ensuite vers des indications pendant la course. Par exemple, au près, on peut aller un peu plus haut et moins vite, ou un peu plus bas et plus vite, et il y a peut-être quelques dixièmes de nœud à gagner sur ce compromis. Un jour, l'app pourrait dire « essaie 2 degrés plus haut, 0,2 nœud moins vite ». On n'y est pas.

## La suite : regarder les voiles

Prochaine étape : des modèles de vision sur les voiles, avec des caméras. Les bandes horizontales sur une voile sont là pour les photos : les voileries s'en servent depuis longtemps pour mesurer la courbure, et pour dessiner les voiles suivantes. Mesurer ça en direct existe déjà, mais coûte autour de 25 000 € et reste réservé aux grosses équipes. L'équipe collecte des photos : une centaine pour l'instant, il en faudrait 1 000 ou 2 000. Les équipes qui ont des gros budgets protègent leurs données, mais une voile reste une aile d'avion, et même un modèle approximatif devrait déjà apporter beaucoup.

## Ce qui reste difficile

Adrien a fini sur ça : même avec les outils d'aujourd'hui, faire quelque chose d'utile dans le monde physique reste difficile. Il faut du travail au bureau, mais aussi sur le terrain pour que tout le matériel soit branché. Et c'est de la conduite du changement : des gens qui naviguent de la même manière depuis 20 ans font un effort énorme pour changer leur façon de régler le bateau.

## Les questions de la salle

- **Pourquoi le navigateur ne se met pas à l'abri à l'intérieur ?** Il n'y a rien à l'intérieur, ça tape, et il doit voir le plan d'eau et parler à l'équipage.
- **Les capteurs ont-ils un protocole commun ?** Oui, ce sont des capteurs marinisés, tous sur le même bus NMEA 2000, à part un analogique.
- **Où en est la course ?** Le bateau a gagné son championnat cette année. Grâce aux entraînements, pas à la tech, d'après l'équipe : la tech, c'est pour les saisons suivantes.
