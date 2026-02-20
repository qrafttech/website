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
  {
    slug: "test-e2e-playwright-ci",
    title: "Mettre en place des tests E2E avec Playwright dans la CI",
    date: "20 jan 2026",
    content:
      "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Sed aliquam ultrices mauris. Integer ante arci, accumsan a, consectetuer eget, posuere ut, mauris.\n\nPraesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing. Pellentesque egestas neque sit amet convallis pulvinar.",
  },
  {
    slug: "docker-multi-stage-nextjs",
    title: "Optimiser les images Docker avec le multi-stage build pour Next.js",
    date: "18 jan 2026",
    content:
      "Cras sagittis. Sed hendrerit. Maecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.\n\nEtiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.",
  },
  {
    slug: "webhooks-notion-nextjs",
    title: "Synchroniser Notion avec Next.js via des webhooks en temps reel",
    date: "15 jan 2026",
    content:
      "Nam pretium turpis et arcu. Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris.\n\nInteger ante arci, accumsan a, consectetuer eget, posuere ut, mauris. Praesent blandit laoreet nibh. Fusce convallis metus id felis luctus adipiscing.",
  },
  {
    slug: "monitoring-sentry-nextjs",
    title: "Integrer Sentry pour le monitoring d'erreurs dans une app Next.js",
    date: "12 jan 2026",
    content:
      "Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi.\n\nNam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.",
  },
  {
    slug: "strategie-cache-redis-api",
    title: "Strategie de cache avec Redis pour accelerer nos API REST",
    date: "8 jan 2026",
    content:
      "Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.\n\nPhasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue.",
  },
  {
    slug: "typescript-strict-mode-migration",
    title:
      "Migrer un projet legacy vers TypeScript strict mode sans tout casser",
    date: "5 jan 2026",
    content:
      "Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo.\n\nNullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.",
  },
  {
    slug: "github-actions-deploy-preview",
    title: "Deployer des previews automatiques avec GitHub Actions et Vercel",
    date: "2 jan 2026",
    content:
      "Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.\n\nMaecenas nec odio et ante tincidunt tempus. Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante.",
  },
  {
    slug: "accessibilite-aria-react",
    title: "Ameliorer l'accessibilite de nos composants React avec ARIA",
    date: "28 dec 2025",
    content:
      "Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien.\n\nVestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui. Cras ultricies mi eu turpis hendrerit fringilla.",
  },
  {
    slug: "turborepo-monorepo-guide",
    title: "Structurer un monorepo performant avec Turborepo et pnpm",
    date: "22 dec 2025",
    content:
      "Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc, litot Europa usa li sam vocabular.\n\nLi lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilite de un nov lingua franca.",
  },
  {
    slug: "design-tokens-tailwind",
    title: "Centraliser les design tokens avec Tailwind CSS et un theme custom",
    date: "18 dec 2025",
    content:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.\n\nNemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
