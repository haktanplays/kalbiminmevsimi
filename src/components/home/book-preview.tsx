import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import type { BookInfo } from "@/lib/types";

interface BookPreviewProps {
  book: BookInfo | null;
}

export function BookPreview({ book }: BookPreviewProps) {
  if (!book) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 py-16 dark:from-blue-950/30 dark:via-sky-950/20 dark:to-indigo-950/30 sm:py-20">
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
          {book.cover_image_url && (
            <div className="relative aspect-[3/4] w-60 shrink-0 overflow-hidden rounded-2xl shadow-2xl ring-4 ring-white/50 dark:ring-white/10">
              <Image
                src={book.cover_image_url}
                alt={book.title}
                fill
                className="object-cover"
                sizes="240px"
              />
            </div>
          )}
          <div className="text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1.5 text-sm font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              <BookOpen size={14} />
              Kitap
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {book.title}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {book.author}
              {book.publisher && ` - ${book.publisher}`}
            </p>
            {book.description && (
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground line-clamp-4">
                {book.description}
              </p>
            )}
            <Link
              href="/kitap"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              Detayları Gör
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
