import Link from "next/link";
import { ArrowRight, BookOpen, PenLine, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-500 via-sky-400 to-background py-24 sm:py-32 lg:py-40">
      {/* Sky decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute left-[10%] top-[15%] h-32 w-48 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute right-[15%] top-[10%] h-24 w-36 rounded-full bg-white/15 blur-2xl" />
        <div className="absolute left-[40%] top-[5%] h-20 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[20%] right-[10%] h-40 w-40 rounded-full bg-sky-300/20 blur-3xl" />
        <div className="absolute bottom-[30%] left-[5%] h-28 w-28 rounded-full bg-blue-300/15 blur-2xl" />
      </div>

      {/* Decorative book motifs */}
      <div className="absolute left-[8%] top-[20%] hidden text-white/10 lg:block">
        <BookOpen size={80} strokeWidth={1} />
      </div>
      <div className="absolute bottom-[25%] right-[8%] hidden text-white/10 lg:block">
        <PenLine size={60} strokeWidth={1} />
      </div>
      <div className="absolute right-[25%] top-[15%] hidden text-white/8 lg:block">
        <Sparkles size={40} strokeWidth={1} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Decorative divider */}
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-white/40" />
            <BookOpen size={20} className="text-white/70" />
            <span className="h-px w-12 bg-white/40" />
          </div>

          <h1 className="font-serif text-4xl font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            Kalbimin Mevsimi
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">
            Kuran Okumaları, Denemeler ve manevi yolculuğun izleri.
            Düşüncelerimizi ve öğrendiklerimizi paylaşıyoruz.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kuran-okumalari"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-blue-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <BookOpen size={16} />
              Kuran Okumaları
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/denemeler"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              <PenLine size={16} />
              Denemeler
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path
            d="M0 40C240 70 480 80 720 60C960 40 1200 20 1440 40V80H0V40Z"
            className="fill-background"
          />
        </svg>
      </div>
    </section>
  );
}
