import Link from "next/link";
import { Instagram, Mail, BookOpen, Heart } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-gradient-to-b from-card to-sky-50/50 dark:to-sky-950/10">
      {/* Decorative top bar */}
      <div className="h-1 bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500" />

      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen size={18} className="text-primary" />
              </span>
              <span className="font-serif text-xl font-bold text-primary">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Sayfalar
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Kuran Okumaları", href: "/kuran-okumalari" },
                { label: "Denemeler", href: "/denemeler" },
                { label: "Kitap", href: "/kitap" },
                { label: "Hakkında", href: "/hakkinda" },
                { label: "İletişim", href: "/iletisim" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Takip Et
            </h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:info@kalbininmevsimi.com"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground hover:shadow-md"
                aria-label="E-posta"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center gap-1.5 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  );
}
