import type { Metadata } from "next";
import { Mail, Instagram, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Bizimle iletişime geçin",
};

export default function IletisimPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Send size={16} className="text-primary" />
        </span>
        <span className="h-px w-8 bg-primary/20" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
        İletişim
      </h1>
      <p className="mt-3 text-muted-foreground">
        Bizimle iletişime geçmek için aşağıdaki kanalları kullanabilirsiniz.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 text-blue-600 dark:from-blue-950 dark:to-sky-950 dark:text-blue-400">
            <Mail size={24} />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">
            E-posta
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sorularınız ve önerileriniz için bize e-posta gönderin.
          </p>
          <a
            href="mailto:info@kalbininmevsimi.com"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            info@kalbininmevsimi.com
          </a>
        </div>

        <div className="rounded-2xl border border-border bg-card p-7 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 text-pink-600 dark:from-purple-950 dark:to-pink-950 dark:text-pink-400">
            <Instagram size={24} />
          </div>
          <h2 className="text-lg font-semibold text-card-foreground">
            Instagram
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Güncel paylaşımlar ve duyurular için takip edin.
          </p>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            @kalbininmevsimi
          </a>
        </div>
      </div>
    </div>
  );
}
