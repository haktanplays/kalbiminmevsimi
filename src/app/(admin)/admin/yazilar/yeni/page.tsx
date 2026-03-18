import { createClient } from "@/lib/supabase/server";
import { ArticleForm } from "@/components/admin/article-form";
import { createArticle } from "@/lib/actions/articles";
import type { Category } from "@/lib/types";

async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as Category[]) || [];
}

export default async function NewArticlePage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Yeni Yazı</h1>
        <p className="mt-1 text-muted-foreground">Yeni bir yazı oluşturun</p>
      </div>

      <ArticleForm categories={categories} action={createArticle} />
    </div>
  );
}
