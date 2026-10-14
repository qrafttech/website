---
title: "Construire un site e-commerce whitelabel avec Next.js"
slug: construire-un-site-e-commerce-whitelabel-avec-next-js
date: 2025-06-20
author: "Nicolas Rouanne"
---

**Auteur :** Nicolas Rouanne

**Date :** 20 juin 2025

---

Je construis un site e-commerce whitelabel avec Next.js : selon l'hôte, le thème change.

Je pense qu'il y a 3 façons de faire :

- préfixer chaque chemin avec `/wl/brand`
- ajouter un paramètre de requête tel que `?wl=itelis`
- ajouter un cookie (ou header) tel que `whitelabel: brand;`

## Construire un site e-commerce whitelabel avec Next.js

Lors de la construction d'un site e-commerce whitelabel, l'un des plus grands défis est de s'assurer que le thème du site peut changer selon l'hôte. Cela peut être particulièrement difficile lorsque vous travaillez avec une base de code unique mais plusieurs marques nécessitant des thèmes différents.

Après de nombreuses recherches et expérimentations, j'ai trouvé qu'il y a trois façons principales d'y parvenir avec Next.js :

### 1. Préfixer chaque chemin avec `/wl/brand`

La première approche consiste à préfixer chaque chemin de votre site avec `/wl/brand`. Cela vous permet d'avoir un ensemble de styles séparé pour chaque marque, qui peut être chargé dynamiquement en fonction du préfixe.

Bien que cette approche fonctionne bien, elle peut être fastidieuse à maintenir si vous avez un grand nombre de marques, car vous devrez créer un ensemble de styles séparé pour chacune.

### 2. Ajouter un paramètre de requête tel que `?wl=brand`

Une autre approche est d'ajouter un paramètre de requête à l'URL de votre site, tel que `?wl=brand`. Cela vous permet de charger les styles appropriés en fonction du paramètre de requête.

Cette approche est plus flexible que la précédente, car elle vous permet d'utiliser un seul ensemble de styles pour toutes vos marques. Cependant, elle peut être plus difficile à implémenter, car vous devrez vous assurer que le paramètre de requête est correctement transmis à chaque page de votre site.

### 3. Ajouter un cookie (ou header) tel que `whitelabel: brand;`

La troisième approche consiste à ajouter un cookie (ou header) à la requête de votre site, tel que `whitelabel: brand;`. Cela vous permet de charger les styles appropriés en fonction du cookie (ou header).

Cette approche est la plus flexible des trois, car elle vous permet d'utiliser un seul ensemble de styles pour toutes vos marques tout en offrant une expérience utilisateur plus fluide. Cependant, elle peut être plus complexe à implémenter, car vous devrez vous assurer que le cookie (ou header) est correctement défini pour chaque requête.

En conclusion, il existe plusieurs façons de construire un site e-commerce whitelabel avec Next.js, chacune avec ses propres avantages et inconvénients. Selon vos besoins spécifiques, vous pouvez choisir l'approche qui vous convient le mieux.
