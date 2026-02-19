import Image from "next/image";
import Link from "next/link";

import dancingStar from "../../public/images/dancing-star.svg";

import SectionTitle from "./SectionTitle";
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
        <SectionTitle className="from-[#e77c40] to-[#f8c618] p-6">
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
          />
        ))}
      </div>
      <div className="pb-16 pt-4 text-center">
        <Link href="/blog">
          <button
            type="button"
            className="rounded-2xl border border-black bg-transparent px-8 py-3 font-medium text-black hover:bg-black/10"
          >
            Voir tous les articles
          </button>
        </Link>
      </div>
    </>
  );
}
