"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteArticle } from "@/lib/actions/articles";
import { formatDateShort } from "@/lib/utils/format-date";
import type { Article } from "@/lib/types";

interface ArticleTableProps {
  articles: Article[];
}

export function ArticleTable({ articles }: ArticleTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" yazısını silmek istediğinize emin misiniz?`)) {
      return;
    }
    setDeletingId(id);
    const result = await deleteArticle(id);
    if (result?.error) {
      alert("Hata: " + result.error);
    }
    setDeletingId(null);
    router.refresh();
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card py-12 text-center">
        <p className="text-muted-foreground">Henüz yazı bulunmuyor.</p>
        <Link
          href="/admin/yazilar/yeni"
          className="mt-4 inline-block text-sm font-medium text-primary"
        >
          İlk yazınızı oluşturun
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Başlık
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Kategori
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Durum
              </th>
              <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Tarih
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                İşlem
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {articles.map((article) => (
              <tr key={article.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-3.5">
                  <span className="text-sm font-medium text-card-foreground">
                    {article.title}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-muted-foreground">
                    {article.category?.name || "-"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      article.is_published
                        ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                        : "bg-yellow-50 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400"
                    }`}
                  >
                    {article.is_published ? "Yayında" : "Taslak"}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm text-muted-foreground">
                    {formatDateShort(article.created_at)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/yazilar/${article.id}/duzenle`}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      title="Düzenle"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={deletingId === article.id}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                      title="Sil"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
