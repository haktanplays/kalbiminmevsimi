import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";
import { updateArticle } from "@/lib/actions/articles";
import type { Article, Category } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

async function getArticle(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .eq("id", id)
    .single();
  return data as Article | null;
}

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as Category[]) || [];
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const [article, categories] = await Promise.all([
    getArticle(id),
    getCategories(),
  ]);

  if (!article) notFound();

  const boundUpdate = updateArticle.bind(null, id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Yazı Düzenle</h1>
        <p className="mt-1 text-muted-foreground">{article.title}</p>
      </div>

      <ArticleForm
        categories={categories}
        article={article}
        action={boundUpdate}
      />
    </div>
  );
}
