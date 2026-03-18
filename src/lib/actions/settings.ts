"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const settings: Record<string, string> = {
    site_title: formData.get("site_title") as string || "",
    site_description: formData.get("site_description") as string || "",
    about_text: formData.get("about_text") as string || "",
    contact_email: formData.get("contact_email") as string || "",
    instagram_access_token: formData.get("instagram_access_token") as string || "",
    instagram_user_id: formData.get("instagram_user_id") as string || "",
  };

  for (const [key, value] of Object.entries(settings)) {
    await supabase
      .from("site_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  }

  revalidatePath("/");
  revalidatePath("/hakkinda");
  return { success: true };
}
