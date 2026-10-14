---
title: "J'ai construit un skill Worktree pour Claude Code. Puis ils l'ont intégré nativement."
slug: j-ai-construit-un-skill-worktree-pour-claude-code-puis-ils-l-ont-integre-nativement
date: 2026-03-02
author: "Nicolas Rouanne"
---

J'ai passé quelques semaines à construire un skill `/worktree` pour Claude Code. Il gérait les worktrees git pour les branches de fonctionnalités : création, copie des permissions, nettoyage après merge, suppression des branches obsolètes. 114 lignes de logique shell soigneusement écrites, et trois autres skills en dépendaient. Aujourd'hui, j'ai tout supprimé et remplacé par un simple flag : `claude --worktree`.

C'est une histoire de tooling custom sur une plateforme qui évolue vite, et de la question de savoir si l'investissement en vaut la peine.

## Ce que j'avais construit

Le skill `/worktree` faisait plusieurs choses :

- **Créait des worktrees** dans des répertoires adjacents avec une convention de nommage cohérente (`myapp-feat-login`)
- **Copiait les permissions** — spécifiquement `.claude/settings.local.json` — pour que le nouveau worktree ne démarre pas avec une ardoise vierge de permissions et ne déclenche pas une cascade de demandes d'approbation
- **Nettoyait** une fois le travail terminé : suppression du worktree, suppression des branches mergées, nettoyage des références remote
- **Servait de dépendance** pour `/pr`, `/merge` et `/review-apply`, qui lui déléguaient toutes leurs opérations worktree

La copie des permissions à elle seule justifiait l'existence du skill. Sans ça, chaque nouveau worktree était une session Claude Code vierge qui ne savait rien des outils que vous aviez déjà approuvés. On passait les cinq premières minutes à cliquer sur « Autoriser » en boucle.

## Ce que Claude Code a livré

Puis Anthropic a ajouté `--worktree` comme flag natif. Quand on lance `claude --worktree`, il :

- Crée un worktree isolé automatiquement
- Branche depuis `origin/main`
- Gère les permissions nativement (plus besoin de copie manuelle)
- Nettoie à la fin de la session

Quatre points qui ont rendu mes 114 lignes obsolètes.

## La migration

Supprimer la logique custom a pris quatre PRs en succession rapide :

1. **Supprimer le skill** **`/worktree`** **entièrement** et intégrer la logique minimale de nettoyage de branches dans `/merge`
2. **Simplifier** **`/pr`** — au lieu de créer des worktrees et copier des fichiers, simplement renommer la branche courante (`git branch -m`), puisque `--worktree` démarre déjà sur une branche isolée depuis `origin/main`
3. **Simplifier** **`/review-apply`** — supprimer la création/nettoyage de worktrees, juste checkout la branche de la PR directement
4. **Supprimer les dernières étapes incompatibles** — le rebase avant push dans `/pr` (inutile puisque les worktrees branchent déjà depuis le dernier main) et le nettoyage local de branches dans `/merge` (GitHub supprime automatiquement les branches remote mergées de toute façon)

Le diff raconte l'histoire : **+2 lignes, -125 lignes**. Les skills sont devenus plus simples, plus fiables, et ont perdu une catégorie entière de cas limites liés à la gestion d'état des worktrees.

## Est-ce que ça vaut le coup de construire des outils custom ?

C'est la question à laquelle je reviens sans cesse. Je pense que la réponse honnête est : **oui, mais c'est douloureux**.

Pourquoi ça vaut le coup :

- **On résout son problème aujourd'hui.** Quand j'ai construit `/worktree`, il n'y avait pas d'alternative native. J'avais besoin de branches isolées pour mes workflows de PR, et j'avais besoin que les permissions suivent. Le skill fonctionnait. Il livrait du code.
- **On apprend la plateforme en profondeur.** Construire le skill m'a forcé à comprendre comment Claude Code gère les permissions, comment les skills s'enchaînent, comment les worktrees interagissent avec le modèle de session. Ce savoir n'a pas disparu quand le skill est devenu obsolète — il a rendu la migration triviale.
- **On influence la plateforme.** Les problèmes qu'on résout avec des outils custom sont des signaux. La portabilité des permissions entre worktrees, le nettoyage à la sortie — ce sont exactement les points de friction que l'implémentation native a adressés. Les early adopters qui construisent des contournements écrivent, en quelque sorte, le cahier des charges de ce que la plateforme devrait faire ensuite.

Pourquoi c'est douloureux :

- **La maintenance est réelle.** Chaque mise à jour de Claude Code peut casser vos skills custom. L'interaction entre skills, permissions et état git crée des cas limites subtils qui prennent du temps à débugger.
- **On va jeter du travail.** Pas « peut-être » — c'est sûr. Si on construit des outils sur une plateforme qui livre chaque semaine, une partie du travail a une durée de vie mesurée en semaines.
- **La version native est toujours meilleure.** Elle a accès à des internals auxquels on n'a pas accès. Elle gère des cas limites auxquels on n'a jamais pensé. Elle n'a pas besoin de hacks de permissions.

## Ce que je dirais à quelqu'un qui débute

Constuis l'outil. Sérieusement. Mais construis-le en sachant qu'il est temporaire.

Garde tes skills custom petits et ciblés. Ne construis pas un framework — construis un script. Moins on investit dans l'abstraction, moins ça fait mal quand on supprime.

Versionne tout. Je garde toutes mes configs Claude Code dans un repo git. Quand j'ai supprimé le skill worktree, je pouvais voir exactement ce qu'il faisait, tracer les dépendances, et vérifier que rien ne pendouillait. Sans ça, la migration aurait été de l'archéologie.

Et quand la plateforme rattrape — et elle le fera — supprime ton code avec gratitude, pas avec regret. Les 114 lignes que j'ai écrites n'étaient pas du gaspillage. C'était un pont qui m'a permis de travailler efficacement en attendant que quelque chose de mieux arrive.

C'est le deal du tooling custom sur une plateforme qui évolue vite. C'est un mal nécessaire. On paie le coût de construire et maintenir des choses qui seront obsolètes, parce que l'alternative c'est attendre — et attendre, c'est ne pas livrer.
