"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { updateSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/client";
import type { SiteSetting } from "@/lib/types";

export default function AyarlarPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("site_settings").select("*");
      const map: Record<string, string> = {};
      (data as SiteSetting[] | null)?.forEach((s) => {
        map[s.key] = s.value;
      });
      setSettings(map);
    }
    load();
  }, []);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    const result = await updateSettings(formData);
    if (result?.success) {
      setMessage("Ayarlar güncellendi.");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Ayarlar</h1>
        <p className="mt-1 text-muted-foreground">
          Site ayarlarını ve Instagram entegrasyonunu yönetin
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

      <form action={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">
            Genel
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Site Başlığı
              </label>
              <input
                name="site_title"
                defaultValue={settings.site_title || ""}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                İletişim E-postası
              </label>
              <input
                name="contact_email"
                type="email"
                defaultValue={settings.contact_email || ""}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Site Açıklaması
              </label>
              <textarea
                name="site_description"
                rows={2}
                defaultValue={settings.site_description || ""}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Hakkında Metni (HTML destekler)
              </label>
              <textarea
                name="about_text"
                rows={6}
                defaultValue={settings.about_text || ""}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Instagram Settings */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold text-card-foreground">
            Instagram
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Instagram Graph API entegrasyonu. Meta Developer hesabınızdan token
            oluşturun.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Instagram User ID
              </label>
              <input
                name="instagram_user_id"
                defaultValue={settings.instagram_user_id || ""}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Instagram kullanıcı ID'si"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                Access Token
              </label>
              <input
                name="instagram_access_token"
                type="password"
                defaultValue={settings.instagram_access_token || ""}
                className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                placeholder="Instagram access token"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Save size={16} />
          Ayarları Kaydet
        </button>
      </form>
    </div>
  );
}
