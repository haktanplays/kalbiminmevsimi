import type { PostFormat, TextPosition } from "./types";

/** §4.2 — footer text. Boş bırakılırsa footer hiç basılmaz. */
export const SMARTPOST_FOOTER_TEXT = "";

/** §4.4 — bir post 1–10 sayfa (Instagram kaydırmalı üst sınırı). */
export const MAX_PAGES = 10;
export const MAX_TITLE_LENGTH = 80;
export const MAX_SECTION_LENGTH = 600;

/** §6.4 — arka plan kütüphanesi sınırı (F2). */
export const MAX_BACKGROUNDS = 12;

/** §5.2 — normalize edilmiş arka planın uzun kenarı. */
export const BACKGROUND_MAX_EDGE = 1920;
export const BACKGROUND_JPEG_QUALITY = 0.86;

/**
 * Kutuya gömülü arka plan seti. Dosyası olmayanlar sessizce atlanır, yani
 * hepsi yerine bir kısmı konsa da uygulama çalışır.
 */
export const BUNDLED_BACKGROUNDS = [
  "merdiven",
  "kitap",
  "yagmurlu-pencere",
  "kemer-manzara",
  "fener-duvar",
  "fener-ahsap",
  "yesil-kapi",
  "vazo-golge",
  "zeytin-yolu",
  "vazo-dal",
] as const;

/** Sırayla denenir; ilk bulunan kullanılır. Uzantıya takılmamak için. */
export const BACKGROUND_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

export const bundledBackgroundUrl = (name: string, extension: string) =>
  `/smartpost/backgrounds/${name}.${extension}`;

/** §4.1 — export ölçüleri. Genişlik her zaman 1080. */
export const CANVAS_WIDTH = 1080;
export const CANVAS_HEIGHT: Record<PostFormat, number> = {
  post: 1350,
  hikaye: 1920,
};

export const FORMAT_LABEL: Record<PostFormat, string> = {
  post: "Post",
  hikaye: "Hikaye",
};

/**
 * Metin sütunu solda durur; sağdaki ~%36'lık şerit arka plandaki dekora
 * (kapı, fener, vazo) ayrılmıştır ve üzerine hiçbir zaman yazı gelmez.
 */
export const COLUMN_LEFT = 96;
export const COLUMN_WIDTH = 600;

/** Sol üstteki yuvarlak sayfa numarası rozeti. */
export const BADGE_SIZE = 88;
export const BADGE_TOP: Record<PostFormat, number> = {
  post: 96,
  hikaye: 300,
};

/**
 * Metnin dikeyde kullanabileceği bant. Hikayede üst/alt 250px'lik Instagram
 * arayüzünün dışında kalır (§4.1 güvenli alan).
 */
export const COLUMN_BAND: Record<PostFormat, { top: number; height: number }> = {
  post: { top: 240, height: 947 },
  hikaye: { top: 444, height: 1095 },
};

/** §4.2 — footer'ın alt kenardan uzaklığı. */
export const FOOTER_OFFSET: Record<PostFormat, number> = {
  post: 72,
  hikaye: 290,
};

export const TEXT_POSITION_OPTIONS: { value: TextPosition; label: string }[] = [
  { value: "ust", label: "Üst" },
  { value: "orta", label: "Orta" },
  { value: "alt", label: "Alt" },
];

/**
 * Bölümlerin temel ölçüleri. Hepsi `--sp-fit` çarpanıyla birlikte küçülür,
 * böylece uzun metin alana kendiliğinden sığar.
 */
export const SECTION_STYLE = {
  title: { size: 68, weight: 600, lineHeight: 1.15 },
  body: { size: 40, weight: 400, lineHeight: 1.5 },
  bottom: { size: 44, weight: 600, lineHeight: 1.35 },
} as const;

export const SECTION_GAP = {
  afterTitle: 30,
  aroundOrnament: 44,
  beforeBottom: 34,
  betweenBlocks: 26,
} as const;

/**
 * Otomatik küçültmenin alt sınırı. Bunun altında yazı telefonda okunmaz hale
 * geldiği için daha fazla küçültmüyoruz; metin taşar ve kullanıcı uyarılır.
 */
export const MIN_FIT_SCALE = 0.6;

/** Bunun altına inen her ölçek "sığıyor ama yazı iyice küçüldü" demektir. */
export const COMFORT_FIT_SCALE = 0.78;

/** Kanvas renkleri — örnek tasarımdaki koyu yeşil/zeytin ailesi. */
export const CANVAS_COLORS = {
  ink: "#2C3A22",
  badge: "#4A5A36",
  badgeInk: "#FFFFFF",
  ornament: "#8A9A6A",
} as const;

/** §7.4 — editör arayüzünün paleti. */
export const COLORS = {
  background: "#F7F3EC",
  card: "#FFFFFF",
  text: "#2B2520",
  secondary: "#6B5E52",
  accent: "#8A6F52",
  divider: "#E6DDD1",
} as const;
