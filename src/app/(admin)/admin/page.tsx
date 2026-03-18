import { createClient } from "@/lib/supabase/server";
import { FileText, Eye, EyeOff, Star } from "lucide-react";
import Link from "next/link";
import type { Article } from "@/lib/types";

async function getDashboardData() {
  const supabase = await createClient();

  const { count: totalArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  const { count: publishedArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  const { count: draftArticles } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("is_published", false);

  const { data: recentArticles } = await supabase
    .from("articles")
    .select("id, title, slug, is_published, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalArticles: totalArticles || 0,
    publishedArticles: publishedArticles || 0,
    draftArticles: draftArticles || 0,
    recentArticles: (recentArticles as Pick<Article, "id" | "title" | "slug" | "is_published" | "created_at">[]) || [],
  };
}

export default async function AdminDashboard() {
  const { totalArticles, publishedArticles, draftArticles, recentArticles } =
    await getDashboardData();

  const stats = [
    {
      label: "Toplam Yazı",
      value: totalArticles,
      icon: <FileText size={20} />,
      color: "bg-primary/10 text-primary",
    },
    {
      label: "Yayında",
      value: publishedArticles,
      icon: <Eye size={20} />,
      color: "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400",
    },
    {
      label: "Taslak",
      value: draftArticles,
      icon: <EyeOff size={20} />,
      color:
        "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Site yönetimi genel görünümü
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-card-foreground">
              {stat.value}
            </p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-semibold text-card-foreground">Son Yazılar</h2>
          <Link
            href="/admin/yazilar/yeni"
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Yeni Yazı
          </Link>
        </div>
        <div className="divide-y divide-border">
          {recentArticles.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">
              Henüz yazı bulunmuyor.
            </div>
          ) : (
            recentArticles.map((article) => (
              <Link
                key={article.id}
                href={`/admin/yazilar/${article.id}/duzenle`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-muted"
              >
                <span className="text-sm font-medium text-card-foreground">
                  {article.title}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    article.is_published
                      ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                  }`}
                >
                  {article.is_published ? "Yayında" : "Taslak"}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
