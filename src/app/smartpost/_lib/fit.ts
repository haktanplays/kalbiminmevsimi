import { MIN_FIT_SCALE } from "./config";

export type FitResult = {
  /** Uygulanan yazı boyutu çarpanı. */
  scale: number;
  /** Metin banda sığdı mı? */
  fits: boolean;
};

export const FIT_VARIABLE = "--sp-fit";
export const COLUMN_ATTR = "data-sp-column";
export const CONTENT_ATTR = "data-sp-content";

/**
 * Metni sütuna sığdırır: `--sp-fit` çarpanını ikili aramayla küçülterek
 * içeriğin bandı taşırmadığı en büyük ölçüyü bulur.
 *
 * Bilerek React state'i yerine doğrudan DOM üstünde çalışır — böylece hem
 * önizleme hem de export aynı fonksiyonu çağırır ve ikisi birebir aynı sonucu
 * verir. Sığmadıysa `fits: false` döner; çağıran uyarıyı gösterir ama kaydı
 * engellemez (kullanıcı kararı).
 */
export function fitCanvasText(canvas: HTMLElement): FitResult {
  const column = canvas.querySelector<HTMLElement>(`[${COLUMN_ATTR}]`);
  const content = canvas.querySelector<HTMLElement>(`[${CONTENT_ATTR}]`);
  if (!column || !content) return { scale: 1, fits: true };

  const available = column.clientHeight;
  if (available <= 0) return { scale: 1, fits: true };

  const apply = (scale: number) => {
    content.style.setProperty(FIT_VARIABLE, String(scale));
    return content.scrollHeight <= available;
  };

  if (apply(1)) return { scale: 1, fits: true };
  if (!apply(MIN_FIT_SCALE)) return { scale: MIN_FIT_SCALE, fits: false };

  let fits = MIN_FIT_SCALE;
  let tooBig = 1;
  for (let i = 0; i < 10; i += 1) {
    const mid = (fits + tooBig) / 2;
    if (apply(mid)) fits = mid;
    else tooBig = mid;
  }

  apply(fits);
  return { scale: fits, fits: true };
}
