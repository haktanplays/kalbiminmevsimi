import { BookOpen, PenLine, Heart, Feather } from "lucide-react";

export function WelcomeSection() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
          {/* Sol taraf - Başlık ve görsel alan */}
          <div className="relative">
            {/* Dekoratif arka plan */}
            <div className="absolute -left-4 -top-4 h-72 w-72 rounded-3xl bg-gradient-to-br from-sky-100 to-blue-200 dark:from-sky-950 dark:to-blue-900 sm:h-80 sm:w-80" />
            <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-3xl border-2 border-primary/20 sm:h-80 sm:w-80" />

            {/* İçerik kartı */}
            <div className="relative rounded-2xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-500 p-8 shadow-xl sm:p-10">
              <Feather size={48} className="mb-6 text-white/30" strokeWidth={1.5} />
              <h2 className="font-serif text-3xl font-bold leading-tight text-white sm:text-4xl">
                Kelimelerin
                <br />
                Huzur Bulduğu
                <br />
                Yer
              </h2>
              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-10 bg-white/40" />
                <span className="text-sm font-medium text-white/70">Kalbimin Mevsimi</span>
              </div>
            </div>
          </div>

          {/* Sağ taraf - İçerik ve açıklama */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <BookOpen size={14} />
              Hoş Geldiniz
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground">
              Kalbimin Mevsimi, manevi yolculuğun ve düşüncelerin buluştuğu bir
              alan. Burada Kuran okumalarından ilham alan yazılar, hayata dair
              denemeler ve yürekten gelen paylaşımlar sizi bekliyor.
            </p>

            {/* Özellik listesi */}
            <div className="mt-8 space-y-5">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-950 dark:to-sky-950">
                  <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground">Kuran Okumaları</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Kuran-ı Kerim&apos;den ilham alan okumalar, tefsir notları ve manevi derinliğe yolculuk.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950 dark:to-orange-950">
                  <PenLine size={20} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground">Denemeler</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Hayata, insana ve zamana dair düşünceler. Kalbin sesini dinleyen yazılar.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-950 dark:to-pink-950">
                  <Heart size={20} className="text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-foreground">Samimi Paylaşımlar</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    İçten, sade ve yürekten gelen sözlerle örülmüş bir köşe.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
