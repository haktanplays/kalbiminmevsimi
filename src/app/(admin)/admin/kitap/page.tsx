"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2 } from "lucide-react";
import { updateBookInfo, addBookPage, deleteBookPage } from "@/lib/actions/book";
import { createClient } from "@/lib/supabase/client";
import type { BookInfo, BookPage } from "@/lib/types";

export default function AdminBookPage() {
  const router = useRouter();
  const [book, setBook] = useState<BookInfo | null>(null);
  const [pages, setPages] = useState<BookPage[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: bookData } = await supabase
        .from("book_info")
        .select("*")
        .limit(1)
        .single();
      const { data: pagesData } = await supabase
        .from("book_pages")
        .select("*")
        .order("sort_order", { ascending: true });
      setBook(bookData as BookInfo | null);
      setPages((pagesData as BookPage[]) || []);
    }
    load();
  }, []);

  async function handleSaveBook(formData: FormData) {
    setError(null);
    setMessage(null);
    const result = await updateBookInfo(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("Kitap bilgileri güncellendi.");
    }
  }

  async function handleAddPage(formData: FormData) {
    setError(null);
    const result = await addBookPage(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    const supabase = createClient();
    const { data } = await supabase
      .from("book_pages")
      .select("*")
      .order("sort_order", { ascending: true });
    setPages((data as BookPage[]) || []);
  }

  async function handleDeletePage(id: string) {
    if (!confirm("Bu sayfayı silmek istediğinize emin misiniz?")) return;
    const result = await deleteBookPage(id);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setPages(pages.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Kitap Yönetimi</h1>
        <p className="mt-1 text-muted-foreground">
          Kitap bilgilerini ve örnek sayfaları yönetin
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-6 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-600 dark:bg-green-950 dark:text-green-400">
          {message}
        </div>
      )}

      {/* Book Info Form */}
      <form
        action={handleSaveBook}
        className="mb-10 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="mb-6 text-lg font-semibold text-card-foreground">
          Kitap Bilgileri
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Kitap Adı
            </label>
            <input
              name="title"
              required
              defaultValue={book?.title || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Yazar
            </label>
            <input
              name="author"
              required
              defaultValue={book?.author || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Yayınevi
            </label>
            <input
              name="publisher"
              defaultValue={book?.publisher || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Yayın Yılı
            </label>
            <input
              name="publish_year"
              type="number"
              defaultValue={book?.publish_year || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Sayfa Sayısı
            </label>
            <input
              name="page_count"
              type="number"
              defaultValue={book?.page_count || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              ISBN
            </label>
            <input
              name="isbn"
              defaultValue={book?.isbn || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Açıklama
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={book?.description || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Kapak Görseli URL
            </label>
            <input
              name="cover_image_url"
              type="url"
              defaultValue={book?.cover_image_url || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Satın Alma Linki
            </label>
            <input
              name="purchase_url"
              type="url"
              defaultValue={book?.purchase_url || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save size={16} />
          Kaydet
        </button>
      </form>

      {/* Book Pages */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-card-foreground">
            Örnek Sayfalar
          </h2>
        </div>

        <form
          action={handleAddPage}
          className="mb-6 flex flex-wrap gap-3 rounded-lg border border-dashed border-border p-4"
        >
          <input
            name="title"
            required
            placeholder="Sayfa adı"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <input
            name="image_url"
            required
            type="url"
            placeholder="Görsel URL'si"
            className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <input
            name="description"
            placeholder="Açıklama (opsiyonel)"
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus size={14} />
            Ekle
          </button>
        </form>

        {pages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Henüz örnek sayfa eklenmemiş.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <div
                key={page.id}
                className="flex items-center gap-3 rounded-lg border border-border p-3"
              >
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.image_url}
                    alt={page.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-card-foreground">
                    {page.title}
                  </p>
                  {page.description && (
                    <p className="truncate text-xs text-muted-foreground">
                      {page.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDeletePage(page.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
