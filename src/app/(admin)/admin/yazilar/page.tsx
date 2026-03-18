import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Plus } from "lucide-react";
import { ArticleTable } from "@/components/admin/article-table";
import type { Article } from "@/lib/types";

async function getArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, category:categories(*)")
    .order("created_at", { ascending: false });
  return (data as Article[]) || [];
}

export default async function AdminArticlesPage() {
  const articles = await getArticles();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Yazılar</h1>
          <p className="mt-1 text-muted-foreground">
            Tüm yazıları yönetin
          </p>
        </div>
        <Link
          href="/admin/yazilar/yeni"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus size={16} />
          Yeni Yazı
        </Link>
      </div>

      <ArticleTable articles={articles} />
    </div>
  );
}
