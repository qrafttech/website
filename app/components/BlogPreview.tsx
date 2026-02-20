import Image from "next/image";
import Link from "next/link";

import dancingStar from "../../public/images/dancing-star.svg";

import SectionTitle from "../../components/SectionTitle";
import BlogCard from "./BlogCard";
import { articles } from "../blog/data";

export default function BlogPreview() {
  return (
    <>
      <div className="relative w-full text-center">
        <Image
          src={dancingStar}
          alt="Little star dancing with light rays"
          className="absolute -top-12 -right-32 animate-grow-and-shrink"
        />
        <SectionTitle className="from-brand-orange to-brand-gold p-6">
          Nos derniers articles
        </SectionTitle>
      </div>
      <div className="grid grid-cols-1 gap-x-12 py-12 md:grid-cols-2">
        {articles.slice(0, 6).map((article) => (
          <BlogCard
            key={article.slug}
            title={article.title}
            date={article.date}
            slug={article.slug}
            compact
          />
        ))}
      </div>
      <div className="pb-16 pt-4 text-center">
        <Link
          href="/blog"
          className="inline-block rounded-2xl border border-black bg-transparent px-8 py-3 font-medium text-black hover:bg-black/10"
        >
          Voir tous les articles
        </Link>
      </div>
    </>
  );
}
