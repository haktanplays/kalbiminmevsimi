import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { getFontEmbedCSS, toPng } from "html-to-image";
import { PostCanvas } from "../_components/PostCanvas";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config";
import { fitCanvasText } from "./fit";
import type { Page, PostSettings } from "./types";

const SHARE_TITLE = "SmartPost";

/**
 * html-to-image son adımda `requestAnimationFrame` bekler. Tarayıcı arka plana
 * alınırsa o kare hiç gelmez ve işlem sonsuza kadar asılı kalır; bu koruma
 * olmadan buton "Hazırlanıyor…" da takılı kalırdı.
 */
const RENDER_TIMEOUT_MS = 45_000;

/**
 * html-to-image, belgedeki BÜTÜN @font-face kurallarını (kök layout'un Geist ve
 * Noto Serif'leri dahil, 34 dosya) indirip base64'e gömer. Bu tek seferlik iş
 * ölçüldüğünde ilk export'u ~14 sn'ye çıkarıyordu. Sonucu bir kez hesaplayıp
 * saklıyoruz; editör açılır açılmaz ısıtıldığı için kullanıcının dokunuşuna
 * hiç maliyet binmiyor.
 */
let fontEmbedPromise: Promise<string> | null = null;

export function primeFontEmbedCSS(): Promise<string> {
  if (!fontEmbedPromise) {
    fontEmbedPromise = getFontEmbedCSS(document.body).catch((error) => {
      console.error(error);
      // Sonraki denemede yeniden kurulsun; boş string toPng'nin kendi
      // gömmesine düşmek anlamına gelir.
      fontEmbedPromise = null;
      return "";
    });
  }
  return fontEmbedPromise;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error("Görsel oluşturma zaman aşımına uğradı.")),
      ms
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

/** §5.3 — `YYYY-MM-DD-HHmm` in the device's local time. */
export function createStamp(date: Date = new Date()): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    `${pad(date.getHours())}${pad(date.getMinutes())}`,
  ].join("-");
}

/**
 * Arka planı `data:` URL'e çevirir. iOS Safari, foreignObject içindeki bir
 * `blob:` kaynağını rasterize ederken çoğu zaman boş bırakıyor; kaynak baştan
 * gömülü olursa html-to-image'ın ayrıca indirmesi gerekmiyor.
 */
const inlinedBackgrounds = new Map<string, string>();

async function toInlineDataUrl(url: string): Promise<string> {
  if (url.startsWith("data:")) return url;
  const cached = inlinedBackgrounds.get(url);
  if (cached) return cached;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Arka plan okunamadı.");
  const blob = await response.blob();
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Arka plan okunamadı."));
    reader.readAsDataURL(blob);
  });
  inlinedBackgrounds.set(url, dataUrl);
  return dataUrl;
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, encoded] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map((image) =>
      image.complete && image.naturalWidth > 0
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            // Resolve on error too: a missing background must not hang the export.
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          })
    )
  );
}

export type RenderResult = {
  files: File[];
  /** 1 tabanlı sayfa numaraları: metin en küçük boyutta bile sığmadı. */
  overflowPages: number[];
};

/**
 * §5.3 — render every page at its true export size and return them as PNG
 * files. Single-page posts take this same path; there is no separate one-page
 * branch. The offscreen container is the one place a PostCanvas is mounted
 * outside the preview, so that all pages can be rasterised in one pass.
 *
 * Önizlemeyle aynı `fitCanvasText` burada da çalışır; böylece ekranda görülen
 * yazı boyutu ile kaydedilen görselinki birebir aynı olur.
 */
export async function renderPagesToFiles(
  pages: Page[],
  settings: PostSettings,
  stamp: string
): Promise<RenderResult> {
  if (!settings.backgroundUrl) {
    throw new Error("Arka plan fotoğrafı seçilmedi.");
  }

  await document.fonts.ready;

  // Export'a giden kopya, arka planı gömülü taşır (iOS Safari için).
  const exportSettings: PostSettings = {
    ...settings,
    backgroundUrl: await toInlineDataUrl(settings.backgroundUrl),
  };

  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "-9999px";
  container.style.pointerEvents = "none";
  document.body.appendChild(container);

  const root = createRoot(container);

  try {
    flushSync(() => {
      root.render(
        createElement(
          "div",
          null,
          pages.map((page, index) =>
            createElement(PostCanvas, {
              key: index,
              page,
              settings: exportSettings,
              pageNumber: index + 1,
            })
          )
        )
      );
    });

    await waitForImages(container);

    const nodes = Array.from(
      container.querySelectorAll<HTMLElement>("[data-smartpost-canvas]")
    );
    if (nodes.length !== pages.length) {
      throw new Error("Sayfalar hazırlanamadı.");
    }

    const overflowPages: number[] = [];
    nodes.forEach((node, index) => {
      if (!fitCanvasText(node).fits) overflowPages.push(index + 1);
    });

    const height = CANVAS_HEIGHT[settings.format];
    // Sayfaların hepsi aynı fontları kullanır; bir kez gömülüp yeniden kullanılır.
    const fontEmbedCSS = await primeFontEmbedCSS();
    const options = {
      width: CANVAS_WIDTH,
      height,
      pixelRatio: 1,
      // Arka plan gömülü bir data URL; bust parametresi onu bozar.
      cacheBust: false,
      fontEmbedCSS: fontEmbedCSS || undefined,
    };

    /**
     * iOS Safari ilk geçişte foreignObject'i gömülü görsel hazır olmadan
     * rasterize edip arka planı boş bırakabiliyor; ikinci geçiş sıcak
     * önbellekle doğru sonucu veriyor. Font gömme zaten önbellekli olduğundan
     * ek geçiş sayfa başına ~60 ms, 10 sayfada bile bütçenin altında.
     */
    const renderNode = async (node: HTMLElement) => {
      await toPng(node, options);
      return toPng(node, options);
    };

    const dataUrls = await withTimeout(
      Promise.all(nodes.map(renderNode)),
      RENDER_TIMEOUT_MS
    );

    const files = dataUrls.map((dataUrl, index) => {
      const name = `smartpost-${settings.format}-${stamp}-${index + 1}.png`;
      return new File([dataUrlToBlob(dataUrl)], name, { type: "image/png" });
    });
    return { files, overflowPages };
  } finally {
    root.unmount();
    container.remove();
  }
}

/**
 * §5.4 — hand the files to iOS. `needs-tap` means the share sheet lost the
 * user-gesture chain (long renders); the caller offers a second tap that calls
 * this again with the files it already has.
 */
export async function shareOrDownload(
  files: File[]
): Promise<"shared" | "downloaded" | "needs-tap"> {
  if (files.length === 0) throw new Error("Paylaşılacak görsel yok.");

  if (navigator.canShare?.({ files })) {
    try {
      await navigator.share({ files, title: SHARE_TITLE });
      return "shared";
    } catch (error) {
      const name = (error as Error)?.name;
      // The user dismissed the sheet — nothing went wrong.
      if (name === "AbortError") return "shared";
      if (name === "NotAllowedError") return "needs-tap";
      throw error;
    }
  }

  for (const file of files) {
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Safari aborts the download if the object URL is revoked straight away.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
  return "downloaded";
}
