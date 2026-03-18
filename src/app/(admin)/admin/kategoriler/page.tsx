"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

export default function KategorilerPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      setCategories((data as Category[]) || []);
    }
    load();
  }, []);

  async function handleCreate(formData: FormData) {
    setError(null);
    const result = await createCategory(formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setShowForm(false);
    router.refresh();
    // Reload categories
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    setCategories((data as Category[]) || []);
  }

  async function handleUpdate(id: string, formData: FormData) {
    setError(null);
    const result = await updateCategory(id, formData);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setEditingId(null);
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });
    setCategories((data as Category[]) || []);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`"${name}" kategorisini silmek istediğinize emin misiniz?`)) return;
    const result = await deleteCategory(id);
    if (result?.error) {
      setError(result.error);
      return;
    }
    setCategories(categories.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Kategoriler</h1>
          <p className="mt-1 text-muted-foreground">
            İçerik kategorilerini yönetin
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? "İptal" : "Yeni Kategori"}
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {showForm && (
        <form
          action={handleCreate}
          className="mb-8 rounded-xl border border-border bg-card p-5"
        >
          <h3 className="mb-4 font-semibold text-card-foreground">
            Yeni Kategori
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              name="name"
              required
              placeholder="Kategori adı"
              className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <input
              name="description"
              placeholder="Açıklama (opsiyonel)"
              className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Oluştur
          </button>
        </form>
      )}

      <div className="rounded-xl border border-border bg-card">
        {categories.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            Henüz kategori bulunmuyor.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-5 py-4"
              >
                {editingId === cat.id ? (
                  <form
                    action={(fd) => handleUpdate(cat.id, fd)}
                    className="flex flex-1 items-center gap-3"
                  >
                    <input
                      name="name"
                      defaultValue={cat.name}
                      required
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                    <input
                      name="description"
                      defaultValue={cat.description || ""}
                      placeholder="Açıklama"
                      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                    >
                      <X size={14} />
                    </button>
                  </form>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">
                        {cat.name}
                      </p>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground">
                          {cat.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        /{cat.slug}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingId(cat.id)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
