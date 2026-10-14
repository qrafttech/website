---
title: "Donner à Claude Code une boucle de feedback avec des captures du simulateur"
slug: donner-a-claude-code-une-boucle-de-feedback-avec-des-captures-du-simulateur
date: 2026-01-27
author: "Nicolas Rouanne"
---

Quand Claude Code exécute des commandes, il voit du texte. Mais pour une app mobile, le texte ne suffit pas - il faut voir l'écran.

L'idée : utiliser `xcrun simctl io booted screenshot` pour capturer le simulateur, puis laisser Claude lire l'image. Maintenant il a une boucle de feedback.

## Configuration

```bash
# Démarrer le simulateur
xcrun simctl boot "iPhone 17 Pro" && open -a Simulator

# Prendre une capture
xcrun simctl io booted screenshot /tmp/screen.png
```

Claude peut lire les fichiers images, donc il voit ce qui est à l'écran et peut s'adapter.

## Ce qui marche

- Claude voit l'état actuel de l'UI
- Il peut identifier les éléments ("Je vois un formulaire de connexion avec des champs téléphone et mot de passe")
- Il peut vérifier si une action a fonctionné en comparant les captures avant/après

## Ce qui ne marche pas encore

- Pas de moyen simple de taper ou écrire dans le simulateur en CLI
- `xcrun simctl` n'a pas de commandes pour le tactile
- Il faudrait Appium ou similaire pour interagir

## Usage pratique

Pour l'instant c'est utile pour :

- Vérifier l'état de l'UI après des commandes
- Déboguer des problèmes de layout
- Générer des captures pour la documentation

Pas un remplacement des tests E2E, mais un moyen simple de donner des yeux à Claude sur l'app.
