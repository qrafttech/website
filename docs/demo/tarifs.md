# Page Tarifs (beta) — spécification

Stack de démonstration pour la présentation `gh-stack`. Rien ici n'est destiné à
être mergé : les trois PR servent uniquement de support visuel.

## Intention

Exposer trois formules d'accompagnement sur une page publique, avec un tableau
comparatif lisible sur mobile.

## Formules

| Formule    | Cible                       | Engagement |
| ---------- | --------------------------- | ---------- |
| Découverte | audit ponctuel              | aucun      |
| Équipe     | accompagnement récurrent    | 3 mois     |
| Partenaire | intégration dans les squads | 6 mois     |

## Découpage de la stack

1. **doc** — cette spécification (la PR du bas).
2. **data** — les données typées consommées par l'UI.
3. **ui** — le composant qui rend le tableau.

Chaque couche ne dépend que des couches en dessous d'elle.
