"use client";

import Image from "next/image";
import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { BookPage } from "@/lib/types";

interface PageGalleryProps {
  pages: BookPage[];
}

export function PageGallery({ pages }: PageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (pages.length === 0) return null;

  const goNext = () => {
    if (selectedIndex !== null && selectedIndex < pages.length - 1) {
      setSelectedIndex(selectedIndex + 1);
    }
  };

  const goPrev = () => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="mb-10 text-center font-serif text-2xl font-bold text-foreground sm:text-3xl">
          Kitaptan Sayfalar
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {pages.map((page, index) => (
            <button
              key={page.id}
              onClick={() => setSelectedIndex(index)}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border transition-all hover:shadow-lg"
            >
              <Image
                src={page.image_url}
                alt={page.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-3">
                <p className="text-xs font-medium text-white">{page.title}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox */}
        {selectedIndex !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <button
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              onClick={() => setSelectedIndex(null)}
            >
              <X size={20} />
            </button>

            {selectedIndex > 0 && (
              <button
                className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            <div
              className="relative max-h-[85vh] max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={pages[selectedIndex].image_url}
                alt={pages[selectedIndex].title}
                width={800}
                height={1100}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
              />
              <p className="mt-3 text-center text-sm text-white/80">
                {pages[selectedIndex].title}
                {pages[selectedIndex].description && (
                  <span className="block text-white/60">
                    {pages[selectedIndex].description}
                  </span>
                )}
              </p>
            </div>

            {selectedIndex < pages.length - 1 && (
              <button
                className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
