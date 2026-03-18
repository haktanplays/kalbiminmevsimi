import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArticleList } from "@/components/articles/article-list";
import { CategoryFilter } from "@/components/articles/category-filter";
import type { Article, Category } from "@/lib/types";

export const metadata: Metadata = {
  title: "Kuran Okumaları",
  description: "Kuran okumaları ve tefsir çalışmaları",
};

export const revalidate = 600;

async function getArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .eq("categories.slug", "kuran-okumalari")
    .order("published_at", { ascending: false });
  return (data as Article[]) || [];
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as Category[]) || [];
}

export default async function KuranOkumalariPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Kuran Okumaları
        </h1>
        <p className="mt-3 text-muted-foreground">
          Kuran okumaları ve tefsir çalışmaları
        </p>
      </div>

      <div className="mb-8">
        <CategoryFilter categories={categories} />
      </div>

      <ArticleList
        articles={articles}
        emptyMessage="Henüz Kuran okuması yazısı bulunmuyor."
      />
    </div>
  );
}
