import type { Article } from "@/lib/types";
import { ArticleCard } from "./article-card";

interface ArticleListProps {
  articles: Article[];
  emptyMessage?: string;
}

export function ArticleList({
  articles,
  emptyMessage = "Henüz yazı bulunmuyor.",
}: ArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
