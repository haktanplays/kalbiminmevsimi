import type { Page, PostFormat, TextPosition, TextTone } from "./types";

/**
 * Kayıt tamamen telefonun kendi hafızasında tutulur; sunucuya hiçbir şey
 * gitmez. Görseller zaten Fotoğraflar'a kaydediliyor, bu yüzden burada
 * yalnızca metin ve ayarlar saklanır — post başına birkaç kilobayt.
 */
const DRAFT_KEY = "smartpost:draft:v1";
const HISTORY_KEY = "smartpost:history:v1";
const PENDING_COPY_KEY = "smartpost:pending-copy:v1";

export const HISTORY_LIMIT = 20;

export type StoredSettings = {
  format: PostFormat;
  textPosition: TextPosition;
  textTone: TextTone;
  showPageNumber: boolean;
  /** Gömülü arka planın adı. Oturumluk bir fotoğraf seçilmişse null. */
  backgroundId: string | null;
};

export type StoredDraft = StoredSettings & {
  pages: Page[];
  activeIndex: number;
};

export type StoredPost = StoredSettings & {
  id: string;
  createdAt: string;
  pages: Page[];
};

/** Safari gizli sekmede localStorage'a yazmayı reddedebilir; sessiz geçiyoruz. */
function read<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Kota dolu veya depolama kapalı — kaydetmemek çökmekten iyidir.
  }
}

function remove(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // yok sayılır
  }
}

export const readDraft = () => read<StoredDraft>(DRAFT_KEY);
export const writeDraft = (draft: StoredDraft) => write(DRAFT_KEY, draft);
export const clearDraft = () => remove(DRAFT_KEY);

export function readHistory(): StoredPost[] {
  const list = read<StoredPost[]>(HISTORY_KEY);
  return Array.isArray(list) ? list : [];
}

/**
 * Geçmiş bir dış store; React'e `useSyncExternalStore` ile bağlanır. Anlık
 * görüntü referans olarak sabit kalmalı, yoksa her render'da yeni dizi dönüp
 * sonsuz döngü olur — bu yüzden ham metin değişmedikçe aynı dizi döner.
 */
const EMPTY_HISTORY: StoredPost[] = [];
let cachedRaw: string | null = null;
let cachedList: StoredPost[] = EMPTY_HISTORY;
const listeners = new Set<() => void>();

function emitHistoryChange(): void {
  listeners.forEach((listener) => listener());
}

export function subscribeHistory(listener: () => void): () => void {
  listeners.add(listener);
  // Başka bir sekmede değişirse burası da tazelensin.
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function getHistorySnapshot(): StoredPost[] {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(HISTORY_KEY);
  } catch {
    raw = null;
  }
  if (raw === cachedRaw) return cachedList;
  cachedRaw = raw;
  cachedList = readHistory();
  return cachedList;
}

/** Sunucuda depolama yok; sabit boş dizi. */
export function getHistoryServerSnapshot(): StoredPost[] {
  return EMPTY_HISTORY;
}

export function addToHistory(post: StoredPost): void {
  const next = [post, ...readHistory().filter((item) => item.id !== post.id)];
  write(HISTORY_KEY, next.slice(0, HISTORY_LIMIT));
  emitHistoryChange();
}

export function removeFromHistory(id: string): void {
  write(HISTORY_KEY, readHistory().filter((item) => item.id !== id));
  emitHistoryChange();
}

/** "Kopyala ve düzenle": Geçmiş yazar, editör okuyup siler. */
export const setPendingCopy = (post: StoredPost) => write(PENDING_COPY_KEY, post);

export function takePendingCopy(): StoredPost | null {
  const post = read<StoredPost>(PENDING_COPY_KEY);
  if (post) remove(PENDING_COPY_KEY);
  return post;
}

/** §6.6 — liste başlığı: başlık, yoksa metnin ilk 40 karakteri. */
export function postLabel(post: StoredPost): string {
  const first = post.pages[0];
  if (!first) return "Boş post";
  const title = first.title.trim();
  if (title) return title;
  const body = [first.topText, first.middleText, first.bottomText]
    .map((value) => value.trim())
    .find(Boolean);
  if (!body) return "Boş post";
  const flat = body.replace(/\s+/g, " ");
  return flat.length > 40 ? `${flat.slice(0, 40)}…` : flat;
}

const FORMATTER = new Intl.DateTimeFormat("tr-TR", {
  dateStyle: "long",
  timeStyle: "short",
  timeZone: "Europe/Istanbul",
});

export function formatPostDate(iso: string): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : FORMATTER.format(date);
}
