"use client";

import { useState } from "react";
import { TiptapEditor } from "./tiptap-editor";
import { Save, Eye, EyeOff } from "lucide-react";
import type { Article, Category } from "@/lib/types";

interface ArticleFormProps {
  categories: Category[];
  article?: Article;
  action: (formData: FormData) => Promise<{ error?: string } | void>;
}

export function ArticleForm({ categories, article, action }: ArticleFormProps) {
  const [content, setContent] = useState(article?.content || "");
  const [isPublished, setIsPublished] = useState(article?.is_published || false);
  const [isFeatured, setIsFeatured] = useState(article?.is_featured || false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("content", content);
    formData.set("is_published", isPublished.toString());
    formData.set("is_featured", isFeatured.toString());
    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content area */}
        <div className="space-y-6 lg:col-span-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Başlık
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={article?.title}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Yazı başlığı"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Özet
            </label>
            <textarea
              name="excerpt"
              rows={3}
              defaultValue={article?.excerpt || ""}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Kısa özet (listelerde ve SEO için)"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              İçerik
            </label>
            <TiptapEditor content={content} onChange={setContent} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Yayınlama
            </h3>
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="flex items-center gap-1.5 text-sm text-foreground">
                  {isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                  {isPublished ? "Yayında" : "Taslak"}
                </span>
              </label>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-sm text-foreground">Öne çıkan</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Kategori
            </h3>
            <select
              name="category_id"
              required
              defaultValue={article?.category_id || ""}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">Yazar</h3>
            <input
              name="author_name"
              type="text"
              defaultValue={article?.author_name || "Yazar"}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Cover Image */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">
              Kapak Görseli
            </h3>
            <input
              name="cover_image_url"
              type="url"
              defaultValue={article?.cover_image_url || ""}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              placeholder="Görsel URL'si"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Supabase Storage veya harici URL
            </p>
          </div>

          {/* SEO */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold text-card-foreground">SEO</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Meta Başlık
                </label>
                <input
                  name="meta_title"
                  type="text"
                  defaultValue={article?.meta_title || ""}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="SEO başlığı (opsiyonel)"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Meta Açıklama
                </label>
                <textarea
                  name="meta_description"
                  rows={2}
                  defaultValue={article?.meta_description || ""}
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  placeholder="SEO açıklaması (opsiyonel)"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <Save size={16} />
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </form>
  );
}
