"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BackgroundStrip } from "./BackgroundStrip";
import { PageChips } from "./PageChips";
import { PostCanvas } from "./PostCanvas";
import {
  BACKGROUND_EXTENSIONS,
  BUNDLED_BACKGROUNDS,
  bundledBackgroundUrl,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLORS,
  COMFORT_FIT_SCALE,
  FORMAT_LABEL,
  MAX_PAGES,
  MAX_SECTION_LENGTH,
  MAX_TITLE_LENGTH,
  TEXT_POSITION_OPTIONS,
} from "../_lib/config";
import {
  createStamp,
  primeFontEmbedCSS,
  renderPagesToFiles,
  shareOrDownload,
} from "../_lib/export";
import { fitCanvasText } from "../_lib/fit";
import { normalizeBackground, UNREADABLE_PHOTO_MESSAGE } from "../_lib/image";
import {
  addToHistory,
  clearDraft,
  readDraft,
  takePendingCopy,
  writeDraft,
  type StoredDraft,
} from "../_lib/storage";
import {
  EMPTY_PAGE,
  isPageEmpty,
  pageCharCount,
  type BackgroundItem,
  type Page,
  type PostFormat,
  type PostSettings,
  type TextPosition,
  type TextTone,
} from "../_lib/types";

type Status = { tone: "success" | "error" | "warn"; text: string };

const UNDO_TIMEOUT_MS = 5000;
const SECTION_TOTAL = MAX_TITLE_LENGTH + MAX_SECTION_LENGTH * 3;

function probeImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = url;
  });
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="flex rounded-xl p-1"
      style={{ backgroundColor: COLORS.divider }}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={isActive}
            className="h-12 flex-1 rounded-lg text-base font-medium transition-opacity"
            style={{
              backgroundColor: isActive ? COLORS.accent : "transparent",
              color: isActive ? "#FFFFFF" : COLORS.secondary,
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  multiline: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [value, resize]);

  // İlk ölçüm yazı tipleri yüklenmeden yapılırsa yanlış yükseklik sabitlenir.
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) resize();
    });
    return () => {
      cancelled = true;
    };
  }, [resize]);

  const shared = {
    value,
    placeholder,
    "aria-label": label,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    className:
      "w-full rounded-xl border px-4 py-3 text-base leading-relaxed outline-none",
    style: {
      borderColor: COLORS.divider,
      backgroundColor: COLORS.card,
      color: COLORS.text,
    },
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm" style={{ color: COLORS.secondary }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          {...shared}
          ref={ref}
          rows={3}
          maxLength={MAX_SECTION_LENGTH}
          className={`${shared.className} resize-none`}
        />
      ) : (
        <input {...shared} type="text" maxLength={MAX_TITLE_LENGTH} />
      )}
    </div>
  );
}

export function PostEditor() {
  const [format, setFormat] = useState<PostFormat>("post");
  const [textPosition, setTextPosition] = useState<TextPosition>("orta");
  const [textTone, setTextTone] = useState<TextTone>("koyu");
  const [showPageNumber, setShowPageNumber] = useState(true);

  const [backgrounds, setBackgrounds] = useState<BackgroundItem[]>([]);
  const [selectedBackgroundId, setSelectedBackgroundId] = useState<string | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  /** §4.2 — gömülü arka planların normalize edilmiş object URL'leri. */
  const [resolvedBackgrounds, setResolvedBackgrounds] = useState<Record<string, string>>({});

  const [pages, setPages] = useState<Page[]>([{ ...EMPTY_PAGE }]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<Status | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[] | null>(null);
  const [undoPage, setUndoPage] = useState<{ index: number; page: Page } | null>(null);
  const [fitScale, setFitScale] = useState(1);
  const [overflowing, setOverflowing] = useState(false);
  const [fitTick, setFitTick] = useState(0);

  const statusTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const objectUrls = useRef<string[]>([]);
  const resolvingBackgrounds = useRef<Set<string>>(new Set());
  /** Arka planlar yüklenmeden önce geri yüklenen taslağın seçimi. */
  const wantedBackgroundId = useRef<string | null>(null);
  const draftRestored = useRef(false);
  /** Geri yükleme "oku ve tüket" olduğu için yalnızca bir kez çalışmalı. */
  const restoreAttempted = useRef(false);
  const [previewWidth, setPreviewWidth] = useState(0);

  const activePage = pages[activeIndex] ?? EMPTY_PAGE;
  const background = backgrounds.find((item) => item.id === selectedBackgroundId) ?? null;
  const canvasHeight = CANVAS_HEIGHT[format];

  /**
   * §4.2 — kanvasa verilen kaynak her zaman bir object URL olmalı. Kullanıcının
   * seçtiği fotoğraf zaten öyle; kutuya gömülü olanlar ham HTTP URL geldiği için
   * burada normalize edilip önbelleğe alınır. Ham URL doğrudan verilseydi
   * html-to-image her export'ta megabaytlık PNG'yi base64'e gömerdi.
   */
  const canvasBackgroundUrl = background
    ? background.isSample
      ? resolvedBackgrounds[background.id] ?? null
      : background.url
    : null;
  const backgroundPreparing = Boolean(background) && canvasBackgroundUrl === null;

  const settings: PostSettings | null = canvasBackgroundUrl
    ? {
        format,
        textPosition,
        textTone,
        showPageNumber,
        backgroundUrl: canvasBackgroundUrl,
      }
    : null;

  const showStatus = useCallback((next: Status, holdMs: number) => {
    if (statusTimer.current) clearTimeout(statusTimer.current);
    setStatus(next);
    if (holdMs > 0) {
      statusTimer.current = setTimeout(() => setStatus(null), holdMs);
    }
  }, []);

  // Kutuya gömülü arka planlar: dosyası olmayanlar sessizce atlanır.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const found = await Promise.all(
        BUNDLED_BACKGROUNDS.map(async (name): Promise<BackgroundItem | null> => {
          for (const extension of BACKGROUND_EXTENSIONS) {
            const url = bundledBackgroundUrl(name, extension);
            if (await probeImage(url)) return { id: name, url, isSample: true };
          }
          return null;
        })
      );
      if (cancelled) return;
      const items = found.filter((item): item is BackgroundItem => item !== null);
      if (items.length === 0) return;
      setBackgrounds((current) => [...items, ...current]);
      // Taslakta bir arka plan varsa onu seç; silinmiş/oturumluk ise ilkine düş.
      const wanted = wantedBackgroundId.current;
      const restored = wanted && items.some((item) => item.id === wanted) ? wanted : null;
      wantedBackgroundId.current = null;
      setSelectedBackgroundId((current) => current ?? restored ?? items[0].id);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Açılışta ya "Kopyala ve düzenle"den gelen post ya da yarım kalan taslak
  // geri yüklenir. Telefon kilitlenip sekme atıldığında yazı kaybolmasın diye.
  useEffect(() => {
    // React geliştirmede efektleri iki kez çağırır; ikinci çağrı bekleyen
    // kopyayı çoktan tüketilmiş bulup taslağa geri düşerdi.
    if (restoreAttempted.current) return;
    restoreAttempted.current = true;

    const copy = takePendingCopy();
    const source: StoredDraft | null = copy
      ? { ...copy, activeIndex: 0 }
      : readDraft();
    if (!source || source.pages.length === 0) {
      draftRestored.current = true;
      return;
    }
    setPages(source.pages);
    setActiveIndex(Math.min(source.activeIndex ?? 0, source.pages.length - 1));
    setFormat(source.format);
    setTextPosition(source.textPosition);
    setTextTone(source.textTone);
    setShowPageNumber(source.showPageNumber);
    wantedBackgroundId.current = source.backgroundId;
    draftRestored.current = true;
  }, []);

  // Fontları arka planda önceden gömer; ilk "Kaydet" dokunuşu böylece beklemez.
  useEffect(() => {
    document.fonts.ready.then(() => {
      void primeFontEmbedCSS();
    });
  }, []);

  // §4.2 — seçilen gömülü arka planı normalize edip object URL'e çevir.
  useEffect(() => {
    const item = background;
    if (!item || !item.isSample) return;
    if (resolvedBackgrounds[item.id] || resolvingBackgrounds.current.has(item.id)) {
      return;
    }
    const { id, url } = item;
    resolvingBackgrounds.current.add(id);
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(UNREADABLE_PHOTO_MESSAGE);
        const blob = await response.blob();
        const normalized = await normalizeBackground(
          new File([blob], `${id}.jpg`, { type: blob.type })
        );
        const objectUrl = URL.createObjectURL(normalized);
        objectUrls.current.push(objectUrl);
        if (cancelled) return;
        setResolvedBackgrounds((current) => ({ ...current, [id]: objectUrl }));
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          showStatus({ tone: "error", text: UNREADABLE_PHOTO_MESSAGE }, 0);
        }
      } finally {
        resolvingBackgrounds.current.delete(id);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [background, resolvedBackgrounds, showStatus]);

  // Taslağı otomatik kaydet. Geri yükleme bitmeden yazmayız, yoksa ilk render
  // boş sayfayı kaydedip taslağın üstüne yazardı.
  useEffect(() => {
    if (!draftRestored.current) return;
    const timer = setTimeout(() => {
      writeDraft({
        pages,
        activeIndex,
        format,
        textPosition,
        textTone,
        showPageNumber,
        backgroundId: background?.isSample ? background.id : null,
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [
    pages,
    activeIndex,
    format,
    textPosition,
    textTone,
    showPageNumber,
    background,
  ]);

  useEffect(() => {
    const urls = objectUrls.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      if (statusTimer.current) clearTimeout(statusTimer.current);
      if (undoTimer.current) clearTimeout(undoTimer.current);
    };
  }, []);

  // §4.1 — önizleme, gerçek kanvasın containerWidth / 1080 oranında küçültülmüşü.
  useEffect(() => {
    const element = previewRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setPreviewWidth(entry.contentRect.width);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.fonts.ready.then(() => setFitTick((tick) => tick + 1));
  }, []);

  /**
   * Önizlemedeki metni sütuna sığdırır. Export ile aynı fonksiyon çalıştığı
   * için ekranda görülen boyut kaydedilenle birebir aynıdır.
   */
  useEffect(() => {
    const node = previewRef.current?.querySelector<HTMLElement>(
      "[data-smartpost-canvas]"
    );
    if (!node) {
      setOverflowing(false);
      setFitScale(1);
      return;
    }
    const result = fitCanvasText(node);
    setOverflowing(!result.fits);
    setFitScale(result.scale);
  }, [
    activePage,
    activeIndex,
    format,
    textPosition,
    textTone,
    showPageNumber,
    background?.url,
    previewWidth,
    fitTick,
  ]);

  function updateActivePage(patch: Partial<Page>) {
    setPages((current) =>
      current.map((page, index) => (index === activeIndex ? { ...page, ...patch } : page))
    );
  }

  async function handlePick(file: File) {
    setPhotoBusy(true);
    setStatus(null);
    try {
      const blob = await normalizeBackground(file);
      const url = URL.createObjectURL(blob);
      objectUrls.current.push(url);
      const id = `bg-${Date.now()}`;
      setBackgrounds((current) => [...current, { id, url }]);
      setSelectedBackgroundId(id);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : UNREADABLE_PHOTO_MESSAGE;
      showStatus({ tone: "error", text: message }, 0);
    } finally {
      setPhotoBusy(false);
    }
  }

  function handleAddPage() {
    if (pages.length >= MAX_PAGES) return;
    setPages((current) => [...current, { ...EMPTY_PAGE }]);
    setActiveIndex(pages.length);
  }

  // §6.5 — yalnızca metinleri sıfırlar; format, arka plan ve ayarlar kalır.
  function handleNewPost() {
    setPages([{ ...EMPTY_PAGE }]);
    setActiveIndex(0);
    setUndoPage(null);
    setPendingFiles(null);
    setStatus(null);
    clearDraft();
  }

  function handleDeletePage() {
    if (pages.length <= 1) return;
    const index = activeIndex;
    const removed = pages[index];
    const remaining = pages.filter((_, i) => i !== index);
    setPages(remaining);
    setActiveIndex(Math.min(index, remaining.length - 1));
    setUndoPage({ index, page: removed });
    if (undoTimer.current) clearTimeout(undoTimer.current);
    undoTimer.current = setTimeout(() => setUndoPage(null), UNDO_TIMEOUT_MS);
  }

  function handleUndoDelete() {
    if (!undoPage) return;
    setPages((current) => {
      const next = [...current];
      next.splice(undoPage.index, 0, undoPage.page);
      return next;
    });
    setActiveIndex(undoPage.index);
    setUndoPage(null);
    if (undoTimer.current) clearTimeout(undoTimer.current);
  }

  function successText(count: number, exportFormat: PostFormat): string {
    if (exportFormat === "hikaye") {
      return count === 1
        ? "Kaydedildi. Instagram'da Hikaye → Fotoğraflar'dan seç."
        : `${count} görsel kaydedildi. Instagram'da Hikaye → Fotoğraflar'dan seç.`;
    }
    return count === 1
      ? "Kaydedildi."
      : `${count} görsel kaydedildi. Instagram'da yeni gönderi → Birden fazla seç → sırayla seç.`;
  }

  function applyShareResult(
    result: Awaited<ReturnType<typeof shareOrDownload>>,
    files: File[],
    overflowPages: number[]
  ) {
    const overflowNote =
      overflowPages.length > 0
        ? ` ${overflowPages.join(", ")}. sayfada metin alana tam sığmadı.`
        : "";

    if (result === "needs-tap") {
      setPendingFiles(files);
      showStatus(
        {
          tone: overflowPages.length ? "warn" : "success",
          text: `Görseller hazır. Paylaşım menüsünü açmak için dokun.${overflowNote}`,
        },
        0
      );
      return;
    }
    setPendingFiles(null);
    if (result === "downloaded") {
      showStatus(
        {
          tone: overflowPages.length ? "warn" : "success",
          text: `Görseller indirildi. Fotoğraflar'a kaydetmek için her görsele uzun basın.${overflowNote}`,
        },
        6000
      );
      return;
    }
    const text = successText(files.length, format) + overflowNote;
    showStatus(
      { tone: overflowPages.length ? "warn" : "success", text },
      text === "Kaydedildi." ? 2000 : 6000
    );
  }

  async function handleExport() {
    if (!settings || exporting) return;
    setExporting(true);
    setStatus(null);
    try {
      // §5.4 — render ile paylaşım menüsü arasına başka bir bekleme girmemeli.
      const { files, overflowPages } = await renderPagesToFiles(
        pages,
        settings,
        createStamp()
      );
      const result = await shareOrDownload(files);
      applyShareResult(result, files, overflowPages);
      addToHistory({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        pages,
        format,
        textPosition,
        textTone,
        showPageNumber,
        backgroundId: background?.isSample ? background.id : null,
      });
    } catch (error) {
      console.error(error);
      showStatus({ tone: "error", text: "Görsel oluşturulamadı. Tekrar dene." }, 0);
    } finally {
      setExporting(false);
    }
  }

  async function handleRetryShare() {
    if (!pendingFiles) return;
    try {
      const result = await shareOrDownload(pendingFiles);
      applyShareResult(result, pendingFiles, []);
    } catch (error) {
      console.error(error);
      showStatus({ tone: "error", text: "Görsel oluşturulamadı. Tekrar dene." }, 0);
    }
  }

  // Taşma neredeyse imkânsız (yazı küçülerek sığıyor); asıl risk yazının
  // telefonda okunamayacak kadar küçülmesi. Uyarı buna göre kuruldu.
  const fitHint = overflowing
    ? { warn: true, text: "Metin sığmıyor — biraz kısalt ya da yeni sayfaya böl." }
    : fitScale < COMFORT_FIT_SCALE
      ? { warn: true, text: "Sığdı ama yazı iyice küçüldü — bölmeyi düşün." }
      : { warn: false, text: "Metin alana rahat sığıyor" };

  const hasEmptyPage = pages.some(isPageEmpty);
  const canExport = Boolean(settings) && !hasEmptyPage && !exporting;
  const primaryLabel =
    pages.length === 1 ? "Görseli Kaydet" : `${pages.length} Görseli Kaydet`;
  const scale = previewWidth > 0 ? previewWidth / CANVAS_WIDTH : 0;
  const statusColor =
    status?.tone === "error" ? "#C0392B" : status?.tone === "warn" ? "#9A6B1F" : "#3F7A54";

  return (
    <div className="flex flex-col gap-6 px-5 pb-10 pt-4">
      <Segmented
        label="Format"
        value={format}
        onChange={setFormat}
        options={[
          { value: "post", label: FORMAT_LABEL.post },
          { value: "hikaye", label: FORMAT_LABEL.hikaye },
        ]}
      />

      <BackgroundStrip
        items={backgrounds}
        selectedId={selectedBackgroundId}
        busy={photoBusy}
        onSelect={setSelectedBackgroundId}
        onPick={handlePick}
      />

      <div
        ref={previewRef}
        className="w-full overflow-hidden rounded-2xl"
        style={{
          height: previewWidth > 0 ? previewWidth * (canvasHeight / CANVAS_WIDTH) : undefined,
          boxShadow: settings ? "0 6px 24px rgba(43,37,32,0.12)" : "none",
          border: settings ? "none" : `2px dashed ${COLORS.divider}`,
          aspectRatio: previewWidth > 0 ? undefined : `${CANVAS_WIDTH} / ${canvasHeight}`,
          backgroundColor: COLORS.card,
        }}
      >
        {settings ? (
          <div
            style={{
              width: CANVAS_WIDTH,
              height: canvasHeight,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <PostCanvas
              page={activePage}
              settings={settings}
              pageNumber={activeIndex + 1}
            />
          </div>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center text-base"
            style={{ color: COLORS.secondary }}
          >
            {backgroundPreparing ? "Fotoğraf hazırlanıyor…" : "Bir fotoğraf seç"}
          </div>
        )}
      </div>

      <PageChips
        pages={pages}
        activeIndex={activeIndex}
        onSelect={setActiveIndex}
        onAdd={handleAddPage}
      />

      {undoPage && (
        <div
          className="flex items-center justify-center gap-3 text-sm"
          style={{ color: COLORS.secondary }}
        >
          <span>Sayfa silindi</span>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            onClick={handleUndoDelete}
            className="underline underline-offset-4"
            style={{ color: COLORS.accent }}
          >
            Geri al
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Segmented
          label="Yazı konumu"
          value={textPosition}
          onChange={setTextPosition}
          options={TEXT_POSITION_OPTIONS}
        />
        <Segmented
          label="Yazı tonu"
          value={textTone}
          onChange={setTextTone}
          options={[
            { value: "koyu", label: "Koyu" },
            { value: "acik", label: "Açık" },
          ]}
        />
      </div>

      <label className="flex min-h-12 items-center gap-3 text-base">
        <input
          type="checkbox"
          checked={showPageNumber}
          onChange={(event) => setShowPageNumber(event.target.checked)}
          className="h-6 w-6 rounded"
          style={{ accentColor: COLORS.accent }}
        />
        <span>Sayfa numarasını göster</span>
      </label>

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleNewPost}
            className="text-sm underline underline-offset-4"
            style={{ color: COLORS.secondary }}
          >
            Yeni post
          </button>
          {pages.length > 1 && (
            <button
              type="button"
              onClick={handleDeletePage}
              className="text-sm underline underline-offset-4"
              style={{ color: COLORS.secondary }}
            >
              Sayfayı sil
            </button>
          )}
        </div>

        <Field
          label="Başlık"
          value={activePage.title}
          onChange={(value) => updateActivePage({ title: value })}
          placeholder="Başlık (isteğe bağlı)"
          multiline={false}
        />
        <Field
          label="Üst metin"
          value={activePage.topText}
          onChange={(value) => updateActivePage({ topText: value })}
          placeholder="Ayracın üstünde kalan metin…"
          multiline
        />
        <Field
          label="Orta metin"
          value={activePage.middleText}
          onChange={(value) => updateActivePage({ middleText: value })}
          placeholder="Ayracın altındaki metin…"
          multiline
        />
        <Field
          label="Alt metin"
          value={activePage.bottomText}
          onChange={(value) => updateActivePage({ bottomText: value })}
          placeholder="Vurgulu kapanış cümlesi…"
          multiline
        />

        <div
          className="rounded-xl px-4 py-3 text-sm leading-relaxed"
          style={{ backgroundColor: COLORS.divider, color: COLORS.secondary }}
        >
          <span className="font-medium">Yazı işaretleri:</span>{" "}
          <code>- madde</code> · <code>&gt; alıntı</code> ·{" "}
          <code>**kalın**</code> · <code>==vurgu==</code> ·{" "}
          <code>*el yazısı*</code>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <span style={{ color: fitHint.warn ? "#9A6B1F" : COLORS.secondary }}>
            {fitHint.text}
          </span>
          <span className="shrink-0" style={{ color: COLORS.secondary }}>
            {pageCharCount(activePage)} / {SECTION_TOTAL}
          </span>
        </div>
      </div>

      {status && (
        <p role="status" className="text-center text-sm" style={{ color: statusColor }}>
          {status.text}
        </p>
      )}

      {pendingFiles ? (
        <button
          type="button"
          onClick={handleRetryShare}
          className="h-14 w-full rounded-xl text-base font-medium"
          style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
        >
          Paylaşım menüsünü aç
        </button>
      ) : (
        <button
          type="button"
          onClick={handleExport}
          disabled={!canExport}
          className="h-14 w-full rounded-xl text-base font-medium disabled:opacity-40"
          style={{ backgroundColor: COLORS.accent, color: "#FFFFFF" }}
        >
          {exporting ? "Hazırlanıyor…" : primaryLabel}
        </button>
      )}
    </div>
  );
}
