import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import type { Article } from "@/lib/types";
import { formatDateShort } from "@/lib/utils/format-date";
import { cn } from "@/lib/utils/cn";

interface ArticleCardProps {
  article: Article;
  className?: string;
}

export function ArticleCard({ article, className }: ArticleCardProps) {
  return (
    <Link
      href={`/yazilar/${article.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border-l-4 border-l-primary border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className
      )}
    >
      {article.cover_image_url && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        {article.category && (
          <span className="mb-3 w-fit rounded-full bg-gradient-to-r from-primary/15 to-sky-400/15 px-3.5 py-1 text-xs font-semibold text-primary">
            {article.category.name}
          </span>
        )}
        <h3 className="mb-2 font-serif text-lg font-bold leading-snug text-card-foreground transition-colors group-hover:text-primary">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {article.excerpt}
          </p>
        )}
        <div className="flex items-center gap-4 border-t border-border/50 pt-4 text-xs text-muted-foreground">
          {article.published_at && (
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-primary/60" />
              {formatDateShort(article.published_at)}
            </span>
          )}
          {article.reading_time_minutes && (
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-primary/60" />
              {article.reading_time_minutes} dk okuma
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
