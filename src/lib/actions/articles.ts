"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { calculateReadingTime } from "@/lib/utils/reading-time";

export async function createArticle(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("category_id") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const metaTitle = formData.get("meta_title") as string;
  const metaDescription = formData.get("meta_description") as string;
  const isPublished = formData.get("is_published") === "true";
  const isFeatured = formData.get("is_featured") === "true";
  const authorName = formData.get("author_name") as string || "Yazar";

  const slug = slugify(title);
  const readingTime = calculateReadingTime(content);

  const { error } = await supabase.from("articles").insert({
    title,
    slug,
    content,
    excerpt: excerpt || null,
    category_id: categoryId,
    cover_image_url: coverImageUrl || null,
    meta_title: metaTitle || null,
    meta_description: metaDescription || null,
    is_published: isPublished,
    is_featured: isFeatured,
    author_name: authorName,
    reading_time_minutes: readingTime,
    published_at: isPublished ? new Date().toISOString() : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/yazilar");
  revalidatePath("/kuran-okumalari");
  revalidatePath("/denemeler");
  redirect("/admin/yazilar");
}

export async function updateArticle(id: string, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = formData.get("category_id") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const metaTitle = formData.get("meta_title") as string;
  const metaDescription = formData.get("meta_description") as string;
  const isPublished = formData.get("is_published") === "true";
  const isFeatured = formData.get("is_featured") === "true";
  const authorName = formData.get("author_name") as string || "Yazar";

  const slug = slugify(title);
  const readingTime = calculateReadingTime(content);

  // Check if article was previously unpublished
  const { data: existingArticle } = await supabase
    .from("articles")
    .select("is_published, published_at")
    .eq("id", id)
    .single();

  const publishedAt =
    isPublished && !existingArticle?.is_published
      ? new Date().toISOString()
      : existingArticle?.published_at;

  const { error } = await supabase
    .from("articles")
    .update({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      category_id: categoryId,
      cover_image_url: coverImageUrl || null,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      is_published: isPublished,
      is_featured: isFeatured,
      author_name: authorName,
      reading_time_minutes: readingTime,
      published_at: isPublished ? publishedAt : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/yazilar");
  revalidatePath(`/yazilar/${slug}`);
  revalidatePath("/kuran-okumalari");
  revalidatePath("/denemeler");
  redirect("/admin/yazilar");
}

export async function deleteArticle(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("articles").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/yazilar");
  revalidatePath("/kuran-okumalari");
  revalidatePath("/denemeler");
  return { success: true };
}
