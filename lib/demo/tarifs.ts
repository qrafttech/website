export type Formule = {
  id: string;
  nom: string;
  cible: string;
  engagement: string;
  prix: string;
};

export const formules: Formule[] = [
  {
    id: "decouverte",
    nom: "Découverte",
    cible: "Audit ponctuel",
    engagement: "Aucun",
    prix: "sur devis",
  },
  {
    id: "equipe",
    nom: "Équipe",
    cible: "Accompagnement récurrent",
    engagement: "3 mois",
    prix: "sur devis",
  },
  {
    id: "partenaire",
    nom: "Partenaire",
    cible: "Intégration dans les squads",
    engagement: "6 mois",
    prix: "sur devis",
  },
];
