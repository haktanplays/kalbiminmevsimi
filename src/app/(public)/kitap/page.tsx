import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { BookHero } from "@/components/book/book-hero";
import { PageGallery } from "@/components/book/page-gallery";
import type { BookInfo, BookPage } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kitap",
  description: "Kitap tanıtımı ve örnek sayfalar",
};

export const revalidate = 3600;

async function getBookInfo(): Promise<BookInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_info")
    .select("*")
    .limit(1)
    .single();
  return data as BookInfo | null;
}

async function getBookPages(): Promise<BookPage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("book_pages")
    .select("*")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });
  return (data as BookPage[]) || [];
}

export default async function KitapPage() {
  const [book, pages] = await Promise.all([getBookInfo(), getBookPages()]);

  if (!book) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-foreground">
          Kitap
        </h1>
        <p className="mt-4 text-muted-foreground">
          Kitap bilgileri yakında eklenecek.
        </p>
      </div>
    );
  }

  return (
    <>
      <BookHero book={book} />
      <PageGallery pages={pages} />
    </>
  );
}
