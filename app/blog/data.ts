export interface Article {
  slug: string;
  title: string;
  date: string;
  content: string;
}

// TODO: Replace with Notion API calls
export const articles: Article[] = [
  {
    slug: "prototype-sig-3d-marseille",
    title:
      "Construire un prototype SIG 3D pour l'hybridation urbaine a Marseille",
    date: "12 fev 2026",
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.\n\nSunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    slug: "config-claude-code-github-pages",
    title: "Publier ma config Claude Code sous forme de site GitHub Pages",
    date: "12 fev 2026",
    content:
      "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.\n\nDonec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo. Quisque sit amet est et sapien ullamcorper pharetra.",
  },
  {
    slug: "api-html-to-pdf",
    title: "Pourquoi nous avons construit notre propre API HTML-to-PDF",
    date: "29 jan 2026",
    content:
      "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.\n\nInteger in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit.\n\nEtiam tempor orci eu lobortis elementum nibh tellus molestie nunc non blandit massa enim nec dui nunc mattis enim ut tellus elementum.",
  },
  {
    slug: "claude-code-sentry-github",
    title:
      "Utiliser Claude Code pour trier les issues Sentry et les lier a GitHub",
    date: "27 jan 2026",
    content:
      "Praesent dapibus, neque id cursus faucibus, tortor neque egestas augue, eu vulputate magna eros eu erat. Aliquam erat volutpat. Nam dui mi, tincidunt quis, accumsan porttitor.\n\nFacilisis luctus metus. Phasellus ultrices nulla quis nibh. Quisque a lectus. Donec consectetuer ligula vulputate sem tristique cursus.",
  },
  {
    slug: "claude-code-feedback-simulateur",
    title:
      "Donner a Claude Code une boucle de feedback avec des captures du simulateur",
    date: "27 jan 2026",
    content:
      "Morbi luctus, wisi viverra faucibus pretium, nibh est placerat odio, nec commodo wisi enim eget quam. Quisque libero justo, consectetuer a, feugiat vitae, porttitor eu, libero.\n\nNullam malesuada erat ut turpis. Suspendisse urna nibh viverra non semper suscipit posuere a pede. Donec nec justo eget felis facilisis fermentum.",
  },
  {
    slug: "migrer-prs-monorepo-format-patch",
    title: "Migrer 13 PRs vers un monorepo avec git format-patch",
    date: "26 jan 2026",
    content:
      "Aliquam posuere. Nulla facilisis, sapien vitae venenatis euismod, est libero commodo enim, eget facilisis enim ipsum vel ante. Integer sagittis auctor metus.\n\nSed diam. Donec tellus libero, fringilla at, hendrerit at, blandit a, tortor. Suspendisse laoreet vulputate libero arcu sed interdum nisl molestie ut.",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
