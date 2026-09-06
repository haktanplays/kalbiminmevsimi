import type { Metadata } from "next";
import { TabBar } from "./_components/TabBar";
import { COLORS } from "./_lib/config";
import { inter } from "./_lib/fonts";

export const metadata: Metadata = {
  title: "SmartPost",
  // Private tool: keep it out of search results even before auth lands (F2).
  robots: { index: false, follow: false },
};

export default function SmartPostLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: COLORS.background,
        color: COLORS.text,
        fontFamily: inter.style.fontFamily,
      }}
    >
      {/* Alt sekme çubuğu sabit; içerik onun altında kalmasın diye boşluk. */}
      <div className="mx-auto w-full max-w-[520px] pb-[calc(76px+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <TabBar />
    </div>
  );
}
