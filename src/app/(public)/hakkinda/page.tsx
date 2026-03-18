import type { Metadata } from "next";
import { BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Hakkında",
  description: "Yazar hakkında bilgiler",
};

export const revalidate = 3600;

async function getAboutText(): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "about_text")
    .single();
  return data?.value || "";
}

export default async function HakkindaPage() {
  const aboutText = await getAboutText();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <BookOpen size={16} className="text-primary" />
        </span>
        <span className="h-px w-8 bg-primary/20" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
        Hakkında
      </h1>

      {aboutText ? (
        <div
          className="prose mt-8 font-serif text-foreground"
          dangerouslySetInnerHTML={{ __html: aboutText }}
        />
      ) : (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-lg leading-relaxed text-muted-foreground">
            Hakkında bilgileri yakında eklenecek. Admin panelinden &quot;Ayarlar&quot;
            bölümünden düzenleyebilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
