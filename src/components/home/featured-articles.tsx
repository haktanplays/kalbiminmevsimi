import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/articles/article-card";

interface FeaturedArticlesProps {
  articles: Article[];
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen size={16} className="text-primary" />
              </span>
              <span className="h-px w-8 bg-primary/20" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              Son Yazılar
            </h2>
            <p className="mt-2 text-muted-foreground">
              En son yayınlanan yazılar ve denemeler
            </p>
          </div>
          <Link
            href="/yazilar"
            className="hidden items-center gap-1.5 rounded-lg bg-primary/5 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 sm:flex"
          >
            Tümünü Gör
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/yazilar"
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary/10 px-6 py-3 text-sm font-medium text-primary"
          >
            Tümünü Gör
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
