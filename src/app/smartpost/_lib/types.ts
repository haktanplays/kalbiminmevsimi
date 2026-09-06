export type PostFormat = "post" | "hikaye";
export type TextPosition = "ust" | "orta" | "alt";
export type TextTone = "acik" | "koyu";

/**
 * §4.4 (revize) — sabit bölümlü sayfa. Ayraç, üst grup (title/topText) ile
 * alt grup (middleText/bottomText) arasında otomatik çıkar.
 */
export type Page = {
  title: string;
  topText: string;
  middleText: string;
  bottomText: string;
};

export type PostSettings = {
  format: PostFormat;
  textPosition: TextPosition;
  textTone: TextTone;
  showPageNumber: boolean;
  /** Object URL of the normalized background image. */
  backgroundUrl: string;
};

export type BackgroundItem = {
  id: string;
  /** Object URL, or the static path of a bundled background. */
  url: string;
  isSample?: boolean;
};

export const EMPTY_PAGE: Page = {
  title: "",
  topText: "",
  middleText: "",
  bottomText: "",
};

export function isPageEmpty(page: Page): boolean {
  return (
    page.title.trim() === "" &&
    page.topText.trim() === "" &&
    page.middleText.trim() === "" &&
    page.bottomText.trim() === ""
  );
}

export function pageCharCount(page: Page): number {
  return (
    page.title.length +
    page.topText.length +
    page.middleText.length +
    page.bottomText.length
  );
}
