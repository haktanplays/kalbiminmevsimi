"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils/slugify";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = slugify(name);

  const { error } = await supabase.from("categories").insert({
    name,
    slug,
    description: description || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/kategoriler");
  revalidatePath("/yazilar");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const slug = slugify(name);

  const { error } = await supabase
    .from("categories")
    .update({ name, slug, description: description || null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/kategoriler");
  revalidatePath("/yazilar");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { count } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return { error: "Bu kategoride yazılar bulunuyor. Önce yazıları silin veya başka kategoriye taşıyın." };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/kategoriler");
  return { success: true };
}
