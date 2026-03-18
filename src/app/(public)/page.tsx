import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/home/hero-section";
import { WelcomeSection } from "@/components/home/welcome-section";
import { FeaturedArticles } from "@/components/home/featured-articles";
import { BookPreview } from "@/components/home/book-preview";
import type { Article, BookInfo } from "@/lib/types";

export const revalidate = 3600;

async function getLatestArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(6);
  return (data as Article[]) || [];
}

async function getBookInfo(): Promise<BookInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("book_info").select("*").limit(1).single();
  return data as BookInfo | null;
}

export default async function HomePage() {
  const [articles, book] = await Promise.all([
    getLatestArticles(),
    getBookInfo(),
  ]);

  return (
    <>
      <HeroSection />
      <WelcomeSection />
      <FeaturedArticles articles={articles} />
      <BookPreview book={book} />
    </>
  );
}
