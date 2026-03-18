"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateBookInfo(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const author = formData.get("author") as string;
  const description = formData.get("description") as string;
  const isbn = formData.get("isbn") as string;
  const publisher = formData.get("publisher") as string;
  const publishYear = formData.get("publish_year") as string;
  const pageCount = formData.get("page_count") as string;
  const coverImageUrl = formData.get("cover_image_url") as string;
  const purchaseUrl = formData.get("purchase_url") as string;

  const { data: existing } = await supabase
    .from("book_info")
    .select("id")
    .limit(1)
    .single();

  const bookData = {
    title,
    author,
    description: description || null,
    isbn: isbn || null,
    publisher: publisher || null,
    publish_year: publishYear ? parseInt(publishYear) : null,
    page_count: pageCount ? parseInt(pageCount) : null,
    cover_image_url: coverImageUrl || null,
    purchase_url: purchaseUrl || null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase
      .from("book_info")
      .update(bookData)
      .eq("id", existing.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("book_info").insert(bookData);
    if (error) return { error: error.message };
  }

  revalidatePath("/kitap");
  revalidatePath("/");
  return { success: true };
}

export async function addBookPage(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const imageUrl = formData.get("image_url") as string;

  const { data: maxOrder } = await supabase
    .from("book_pages")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const { error } = await supabase.from("book_pages").insert({
    title,
    description: description || null,
    image_url: imageUrl,
    sort_order: (maxOrder?.sort_order || 0) + 1,
  });

  if (error) return { error: error.message };

  revalidatePath("/kitap");
  revalidatePath("/admin/kitap");
  return { success: true };
}

export async function deleteBookPage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("book_pages").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/kitap");
  revalidatePath("/admin/kitap");
  return { success: true };
}
