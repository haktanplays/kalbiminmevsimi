import { Cormorant_Garamond, Inter } from "next/font/google";

/**
 * §4.3 — display/body serif and UI sans, self-hosted through next/font.
 * `latin-ext` is required for the Turkish ğ / ş / ı glyphs.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  // Gerçek italik kesim: `*…*` vurgusu sahte eğim yerine bunu kullanır.
  style: ["normal", "italic"],
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
