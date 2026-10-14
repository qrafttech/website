---
title: "Comment on a construit notre blog avec Notion, Next.js et l'invalidation granulaire du cache"
slug: comment-on-a-construit-notre-blog-avec-notion-next-js-et-l-invalidation-granulaire-du-cache
date: 2026-03-05
author: "Nicolas Rouanne"
---

**Auteur :** Nicolas Rouanne

**Date :** 5 mars 2026

---

Je voulais un blog pour le site Qraft, mais sans construire un CMS complet ni gérer une base de données. On utilise déjà Notion en interne, et son API est solide. L'idée était simple : écrire les articles dans Notion, les afficher sur le site avec Next.js, et utiliser le cache de Vercel pour que tout reste rapide. Il a fallu 5 PRs pour y arriver, et l'architecture finale s'est avérée plus propre que prévu.

## Pourquoi Notion comme CMS

Le point de départ, c'était le SEO. On voulait que les articles soient des pages complètes rendues côté serveur sur notre domaine, pas des liens vers Notion. Google les indexe correctement, et on obtient des sitelinks dans les résultats de recherche. Mais on ne voulait pas non plus maintenir un CMS séparé — Notion est déjà l'endroit où on rédige notre contenu.

L'API Notion nous donne tout ce qu'il faut : une base de données pour les métadonnées (titre, date, auteur, langue), et une API de blocs pour le contenu réel. Le compromis, c'est que le modèle de blocs de Notion est plus complexe que du Markdown, mais il se traduit bien en composants React.

## L'architecture

Le système comporte quatre couches :

1. **Notion** — la base de données de contenu. Les auteurs écrivent directement dans Notion.
2. **Couche de données Next.js** — récupère et met en cache le contenu depuis l'API Notion.
3. **Cache Vercel** — stocke les pages rendues avec des tags de cache granulaires.
4. **Endpoint webhook** — reçoit les événements Notion et invalide les bonnes entrées de cache.

Voici le flux de données :

```javascript
Base de données Notion
  ↓ (événement webhook)
POST /api/revalidate
  ↓ (vérification HMAC)
Mapping des tags de cache
  ↓
revalidateTag() → invalider l'entrée spécifique
  ↓
Requête suivante → nouveau fetch depuis l'API Notion
  ↓
NotionRenderer → HTML rendu côté serveur
```

## Récupération du contenu

Le client Notion est simple. On utilise le SDK officiel `@notionhq/client` avec une logique de retry :

```typescript
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
  retry: { maxRetries: 3 },
});
```

Deux fonctions principales gèrent la récupération des données. `fetchArticles()` interroge la base pour la liste des articles, et `fetchArticleById()` récupère un article avec tous ses blocs.

La partie intéressante, c'est le fonctionnement des blocs. Le contenu Notion est un arbre — paragraphes, titres, listes, images, chacun pouvant contenir des enfants imbriqués. On les récupère récursivement jusqu'à 5 niveaux de profondeur :

```typescript
async function fetchAllBlocks(
  blockId: string,
  depth = 0
): Promise<NotionBlock[]> {
  if (depth >= MAX_BLOCK_DEPTH) return [];

  const blocks: NotionBlock[] = [];
  let cursor: string | undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      start_cursor: cursor,
    });

    const typed = response.results
      .filter((b): b is NotionBlock => "type" in b);
    await Promise.all(
      typed.map(async (block) => {
        if (block.has_children) {
          block.children = await fetchAllBlocks(
            block.id, depth + 1
          );
        }
      })
    );
    blocks.push(...typed);

    cursor = response.has_more
      ? response.next_cursor ?? undefined
      : undefined;
  } while (cursor);

  return blocks;
}
```

## Cache avec tags granulaires

C'est là que ça devient intéressant. On utilise la directive `"use cache"` de Next.js 16 avec `cacheLife("max")` pour un cache agressif. Mais l'idée clé, ce sont les **tags de cache granulaires**.

Au début, on avait un seul tag `blog-articles` pour tout. Modifier un article invalidait le cache de tous les articles et de la page de listing. Pas idéal.

L'approche finale utilise deux patterns de tags :

```typescript
export async function fetchArticles(): Promise<ArticleMeta[]> {
  "use cache";
  cacheLife("max");
  cacheTag("blog-list");
  // ...
}

export async function fetchArticleById(
  id: string
): Promise<ArticleFull | null> {
  "use cache";
  cacheLife("max");
  cacheTag(`blog-article-${id}`);
  // ...
}
```

- `blog-list` — tague la requête de listing des articles
- `blog-article-{id}` — tague chaque article individuellement

Résultat : modifier le contenu d'un article n'invalide que le cache de cet article. Le listing et tous les autres articles restent en cache.

## Revalidation par webhook

Notion envoie des événements webhook quand les pages changent. Notre endpoint `/api/revalidate` associe chaque type d'événement aux tags de cache concernés :

```typescript
const tagsByEvent: Record<string, (pageId: string) => string[]> = {
  "page.content_updated": (id) =>
    id ? [`blog-article-${id}`] : [],
  "page.properties_updated": (id) =>
    id ? ["blog-list", `blog-article-${id}`] : ["blog-list"],
  "page.created": () => ["blog-list"],
  "page.deleted": (id) =>
    id ? ["blog-list", `blog-article-${id}`] : ["blog-list"],
};
```

La logique est intuitive :

- **Contenu modifié** → seulement le cache de cet article
- **Propriétés modifiées** (titre, date, auteur) → le listing _et_ l'article
- **Création ou suppression** → le listing (et l'article le cas échéant)

La sécurité passe par une vérification de signature HMAC-SHA256. Notion signe chaque payload de webhook, et on vérifie avec une comparaison timing-safe avant de traiter quoi que ce soit.

## Le choix des slugs

Une décision qui a évolué pendant le développement : les slugs d'URL. On générait initialement les slugs à partir des titres d'articles (ex : `/blog/comment-on-a-construit-notre-blog`). Le problème est évident : renommer un article dans Notion, et tous les liens cassent.

On est passés à l'utilisation de l'ID de page Notion comme slug : `/blog/a1b2c3d4-e5f6-7890`. Ce n'est pas esthétique, mais c'est stable. Et ça a un effet secondaire appréciable — `fetchArticleById()` peut récupérer une page directement par ID en un seul appel API, au lieu d'interroger toute la base de données pour filtrer.

## Rendu des blocs Notion

Un composant serveur `NotionRenderer` gère le rendu récursif des blocs Notion en React. Il supporte les paragraphes, titres, listes (avec imbrication), blocs de code, images, citations, callouts et séparateurs. Les annotations de texte riche (gras, italique, code, liens) sont traduites en HTML correspondant.

La partie la plus délicate était le regroupement des listes. Notion retourne les éléments de liste comme des blocs individuels, mais le HTML a besoin de les envelopper dans des éléments `<ul>` ou `<ol>`. Le renderer regroupe les éléments consécutifs et gère l'imbrication via les enfants récursifs.

## Ce qui fonctionne bien

- **Le workflow de contenu est fluide.** Écrivez dans Notion, ça apparaît sur le site en quelques secondes.
- **L'invalidation du cache est chirurgicale.** Modifier un article n'affecte pas les autres.
- **Pas de base de données à gérer.** Notion est la source unique de vérité.
- **Le SEO est solide.** Pages complètes rendues côté serveur avec des balises meta pertinentes. `generateStaticParams` pré-rend les articles connus au build.
- **Résilience.** Fallbacks gracieux en cas d'erreur API — des tableaux vides plutôt que des crashs.

## Limites

- **Rate limits de l'API Notion.** Avec beaucoup d'articles ou du contenu très imbriqué, on peut atteindre les limites. La logique de retry aide, mais c'est à surveiller.
- **Couverture des types de blocs.** Le renderer ne supporte pas tous les types de blocs Notion. On a construit ce dont on a besoin et on ajoute le support au fur et à mesure.
- **Esthétique des URLs.** Les slugs en ID de page ne sont pas lisibles par un humain. Un compromis valable pour la stabilité, mais à noter.
- **Notion est une dépendance.** Si l'API Notion est en panne, le cache sert du contenu périmé, mais les nouveaux articles n'apparaîtront pas tant qu'elle ne sera pas rétablie.

## Points clés à retenir

Cette architecture fonctionne bien pour un blog de taille petite à moyenne où l'équipe utilise déjà Notion. Les choix architecturaux clés :

1. **Tags de cache granulaires** plutôt qu'un tag partagé unique — permet d'invalider précisément ce qui a changé.
2. **Slugs basés sur l'ID** plutôt que sur le titre — des URLs stables qui ne cassent pas au renommage.
3. **Revalidation par webhook** plutôt que de l'ISR temporel — les mises à jour apparaissent en secondes, pas en minutes.
4. **Récupération récursive des blocs** avec une limite de profondeur — gère le contenu imbriqué sans risquer de boucle infinie.

Je n'utiliserais pas cette approche pour un site avec des milliers d'articles ou des workflows de contenu complexes. Mais pour un blog d'entreprise où quelques personnes écrivent des articles dans Notion ? C'est exactement le bon niveau de complexité.
