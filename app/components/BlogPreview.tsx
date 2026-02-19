import Image from "next/image";

import dancingStar from "../../public/images/dancing-star.svg";

import SectionTitle from "./SectionTitle";
import BlogCard from "./BlogCard";

//This is a placeholder : real article will be fetch from Notion
const articles = [
  {
    title:
      "Construire un prototype SIG 3D pour l'hybridation urbaine a Marseille",
    date: "12 fev 2026",
    url: "https://qrafttech.notion.site/305218ed56d78111af6fde76f71f4943",
  },
  {
    title: "Publier ma config Claude Code sous forme de site GitHub Pages",
    date: "12 fev 2026",
    url: "https://qrafttech.notion.site/305218ed56d781889922effa8174cef4",
  },
  {
    title: "Pourquoi nous avons construit notre propre API HTML-to-PDF",
    date: "29 jan 2026",
    url: "https://qrafttech.notion.site/2f7218ed56d7819b946efd0ab0c34701",
  },
  {
    title:
      "Utiliser Claude Code pour trier les issues Sentry et les lier a GitHub",
    date: "27 jan 2026",
    url: "https://qrafttech.notion.site/2f5218ed56d7819fb3d1d23d0c77bf67",
  },
  {
    title:
      "Donner a Claude Code une boucle de feedback avec des captures du simulateur",
    date: "27 jan 2026",
    url: "https://qrafttech.notion.site/2f5218ed56d781d8acd6c44c02596a88",
  },
  {
    title: "Migrer 13 PRs vers un monorepo avec git format-patch",
    date: "26 jan 2026",
    url: "https://qrafttech.notion.site/2f4218ed56d7813aa6aae0c26bb9fd41",
  },
];

export default function BlogPreview() {
  return (
    <>
      <div className="relative w-full text-center">
        <Image
          src={dancingStar}
          alt="Little star dancing with light rays"
          className="absolute -top-12 -right-32 animate-grow-and-shrink"
        />
        <SectionTitle className="from-[#e77c40] to-[#f8c618] p-6">
          Nos derniers articles
        </SectionTitle>
      </div>
      <div className="grid grid-cols-1 gap-x-12 py-12 md:grid-cols-2">
        {articles.map((article) => (
          <BlogCard key={article.url} {...article} />
        ))}
      </div>
      <div className="pb-16 pt-4 text-center">
        <a
          href="https://qrafttech.notion.site/Blog-FR-2f0218ed56d781c9af6fe090e5d88092"
          target="_blank"
          rel="noreferrer"
        >
          <button
            type="button"
            className="rounded-2xl border border-black bg-transparent px-8 py-3 font-medium text-black hover:bg-black/10"
          >
            Voir tous les articles
          </button>
        </a>
      </div>
    </>
  );
}
