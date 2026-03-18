import Image from "next/image";
import { BookOpen, ExternalLink } from "lucide-react";
import type { BookInfo } from "@/lib/types";

interface BookHeroProps {
  book: BookInfo;
}

export function BookHero({ book }: BookHeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-16 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-indigo-950/30 sm:py-24">
      {/* Decorative */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-12 md:flex-row md:gap-16">
          {book.cover_image_url && (
            <div className="relative aspect-[3/4] w-64 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-white/10 sm:w-72">
              <Image
                src={book.cover_image_url}
                alt={book.title}
                fill
                className="object-cover"
                sizes="280px"
                priority
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <BookOpen size={14} />
              Kitap
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              {book.title}
            </h1>
            <p className="mt-3 text-lg text-muted-foreground">
              {book.author}
            </p>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {book.publisher && (
                <span className="rounded-lg bg-card px-3 py-1.5 shadow-sm">
                  <strong className="text-foreground">Yayınevi:</strong>{" "}
                  {book.publisher}
                </span>
              )}
              {book.publish_year && (
                <span className="rounded-lg bg-card px-3 py-1.5 shadow-sm">
                  <strong className="text-foreground">Yıl:</strong>{" "}
                  {book.publish_year}
                </span>
              )}
              {book.page_count && (
                <span className="rounded-lg bg-card px-3 py-1.5 shadow-sm">
                  <strong className="text-foreground">Sayfa:</strong>{" "}
                  {book.page_count}
                </span>
              )}
              {book.isbn && (
                <span className="rounded-lg bg-card px-3 py-1.5 shadow-sm">
                  <strong className="text-foreground">ISBN:</strong>{" "}
                  {book.isbn}
                </span>
              )}
            </div>

            {book.description && (
              <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">
                {book.description}
              </p>
            )}

            {book.purchase_url && (
              <a
                href={book.purchase_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Satın Al
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
