import type { CSSProperties } from "react";
import { Ornament } from "./Ornament";
import {
  BADGE_SIZE,
  BADGE_TOP,
  CANVAS_COLORS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLUMN_BAND,
  COLUMN_LEFT,
  COLUMN_WIDTH,
  FOOTER_OFFSET,
  SECTION_GAP,
  SECTION_STYLE,
  SMARTPOST_FOOTER_TEXT,
} from "../_lib/config";
import { COLUMN_ATTR, CONTENT_ATTR, FIT_VARIABLE } from "../_lib/fit";
import { cormorant, inter } from "../_lib/fonts";
import type { Page, PostSettings, TextTone } from "../_lib/types";

/**
 * §4.2 (revize) — okunabilirlik katmanı. Soldan sağa açılır: metin sütununu
 * hafifçe yatıştırır, sağdaki dekoru hiç örtmez.
 */
const SCRIM: Record<TextTone, string> = {
  koyu: "linear-gradient(90deg, rgba(247,243,236,0.55) 0%, rgba(247,243,236,0.28) 55%, rgba(247,243,236,0) 78%)",
  acik: "linear-gradient(90deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0) 78%)",
};

const INK: Record<TextTone, string> = {
  koyu: CANVAS_COLORS.ink,
  acik: "#FFFFFF",
};

/** `*el yazısı*`, alıntı tırnakları ve vurgu için ikincil renk. */
const ACCENT: Record<TextTone, string> = {
  koyu: CANVAS_COLORS.badge,
  acik: CANVAS_COLORS.ornament,
};

const SHADOW: Record<TextTone, string | undefined> = {
  koyu: undefined,
  acik: "0 2px 12px rgba(0,0,0,0.35)",
};

/** Uzun metin küçülürken boşluklar da aynı oranda küçülsün. */
const scaled = (px: number) => `calc(${px}px * var(${FIT_VARIABLE}))`;

const FOOTER_LABEL = SMARTPOST_FOOTER_TEXT.toLocaleUpperCase("tr-TR");

type Block =
  | { kind: "text"; lines: string[] }
  | { kind: "list"; items: string[] }
  | { kind: "quote"; lines: string[] };

/**
 * Satır başındaki "- " madde, "> " ise alıntı yapar. Ek arayüz gerektirmez;
 * kullanmayan için hiçbir şey değişmez.
 */
function parseBlocks(value: string): Block[] {
  const blocks: Block[] = [];
  let lines: string[] = [];
  let items: string[] = [];
  let quote: string[] = [];

  const flushLines = () => {
    while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
    if (lines.length) blocks.push({ kind: "text", lines });
    lines = [];
  };
  const flushItems = () => {
    if (items.length) blocks.push({ kind: "list", items });
    items = [];
  };
  const flushQuote = () => {
    if (quote.length) blocks.push({ kind: "quote", lines: quote });
    quote = [];
  };

  // Alıntı, ilk "> " satırından sonra boş satıra kadar sürer; her satıra
  // tekrar "> " yazmak gerekmesin diye.
  let inQuote = false;

  for (const raw of value.split("\n")) {
    const bullet = raw.match(/^\s*[-•]\s+(.*)$/);
    const quoted = raw.match(/^\s*>\s?(.*)$/);
    if (bullet) {
      flushLines();
      flushQuote();
      inQuote = false;
      items.push(bullet[1]);
    } else if (quoted) {
      flushLines();
      flushItems();
      inQuote = true;
      quote.push(quoted[1]);
    } else if (inQuote && raw.trim() !== "") {
      quote.push(raw);
    } else {
      flushItems();
      flushQuote();
      inQuote = false;
      if (lines.length || raw.trim() !== "") lines.push(raw);
    }
  }
  flushItems();
  flushQuote();
  flushLines();
  return blocks;
}

/** `**kalın**`, `==vurgu==`, `*el yazısı*` — satır içi işaretler. */
const INLINE_PATTERN = /(\*\*[^*\n]+\*\*|==[^=\n]+==|\*[^*\n]+\*)/g;

function Inline({ value, accent }: { value: string; accent: string }) {
  return (
    <>
      {value.split(INLINE_PATTERN).map((part, index) => {
        if (!part) return null;
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} style={{ fontWeight: 600 }}>
              {part.slice(2, -2)}
            </strong>
          );
        }
        if (part.startsWith("==") && part.endsWith("==")) {
          return (
            <span
              key={index}
              style={{
                backgroundColor: CANVAS_COLORS.badge,
                color: CANVAS_COLORS.badgeInk,
                padding: "0.04em 0.3em",
                borderRadius: "0.18em",
                // Vurgu iki satıra bölünürse her parçası ayrı zemin alsın.
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
                textShadow: "none",
              }}
            >
              {part.slice(2, -2)}
            </span>
          );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return (
            <em key={index} style={{ fontStyle: "italic", color: accent }}>
              {part.slice(1, -1)}
            </em>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function RichText({
  value,
  size,
  weight,
  lineHeight,
  color,
  textShadow,
  accent,
}: {
  value: string;
  size: number;
  weight: number;
  lineHeight: number;
  color: string;
  textShadow?: string;
  accent: string;
}) {
  const blocks = parseBlocks(value);
  if (blocks.length === 0) return null;

  const base: CSSProperties = {
    fontFamily: cormorant.style.fontFamily,
    fontWeight: weight,
    fontSize: scaled(size),
    lineHeight,
    color,
    textShadow,
  };

  const gapTop = (index: number) =>
    index === 0 ? 0 : scaled(SECTION_GAP.betweenBlocks);

  return (
    <div style={base}>
      {blocks.map((block, index) => {
        if (block.kind === "text") {
          return (
            <div
              key={index}
              style={{ whiteSpace: "pre-wrap", marginTop: gapTop(index) }}
            >
              <Inline value={block.lines.join("\n")} accent={accent} />
            </div>
          );
        }

        if (block.kind === "quote") {
          return (
            <div
              key={index}
              style={{
                position: "relative",
                paddingLeft: scaled(54),
                marginTop: gapTop(index),
                whiteSpace: "pre-wrap",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: scaled(-2),
                  fontSize: scaled(size * 1.8),
                  lineHeight: 1,
                  color: accent,
                  fontFamily: cormorant.style.fontFamily,
                }}
              >
                “
              </span>
              <Inline value={block.lines.join("\n")} accent={accent} />
              <span
                aria-hidden="true"
                style={{
                  fontSize: scaled(size * 1.8),
                  lineHeight: 0,
                  color: accent,
                  verticalAlign: "-0.34em",
                  marginLeft: scaled(6),
                }}
              >
                ”
              </span>
            </div>
          );
        }

        return (
          <div key={index} style={{ marginTop: gapTop(index) }}>
            {block.items.map((item, itemIndex) => (
              // Blok + mutlak konumlu işaret: flex satırların yüksekliği
              // html-to-image'ın SVG klonunda korunmuyor ve iki satıra taşan
              // maddeler üst üste biniyordu.
              <div
                key={itemIndex}
                style={{
                  position: "relative",
                  paddingLeft: scaled(38),
                  marginTop: itemIndex === 0 ? 0 : scaled(12),
                  whiteSpace: "pre-wrap",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ position: "absolute", left: 0, top: 0 }}
                >
                  •
                </span>
                <Inline value={item} accent={accent} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

const JUSTIFY: Record<PostSettings["textPosition"], CSSProperties["justifyContent"]> =
  {
    ust: "flex-start",
    orta: "center",
    alt: "flex-end",
  };

/**
 * §4 (revize) — "foto" şablonu, gerçek export ölçüsünde (1080×1350 / 1080×1920).
 * Metin solda sabit genişlikte bir sütunda durur; sağdaki şerit arka plandaki
 * dekora ayrılmıştır. Önizleme bu düğümü CSS transform ile küçültür, export
 * aynı bileşeni rasterize eder — ikisi birebir aynıdır.
 */
export function PostCanvas({
  page,
  settings,
  pageNumber,
}: {
  page: Page;
  settings: PostSettings;
  pageNumber: number;
}) {
  const height = CANVAS_HEIGHT[settings.format];
  const band = COLUMN_BAND[settings.format];
  const color = INK[settings.textTone];
  const textShadow = SHADOW[settings.textTone];
  const accent = ACCENT[settings.textTone];

  const hasUpper = page.title.trim() !== "" || page.topText.trim() !== "";
  const hasLower =
    page.middleText.trim() !== "" || page.bottomText.trim() !== "";

  return (
    <div
      data-smartpost-canvas=""
      style={{
        position: "relative",
        width: CANVAS_WIDTH,
        height,
        overflow: "hidden",
        backgroundColor: "#F7F3EC",
        flexShrink: 0,
      }}
    >
      {/* next/image object URL sunamaz, html-to-image de düz bir <img> ister. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={settings.backgroundUrl}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: SCRIM[settings.textTone],
        }}
      />

      {settings.showPageNumber && (
        <div
          style={{
            position: "absolute",
            left: COLUMN_LEFT,
            top: BADGE_TOP[settings.format],
            width: BADGE_SIZE,
            height: BADGE_SIZE,
            borderRadius: "50%",
            backgroundColor: CANVAS_COLORS.badge,
            color: CANVAS_COLORS.badgeInk,
            fontFamily: inter.style.fontFamily,
            fontSize: 44,
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {pageNumber}
        </div>
      )}

      <div
        {...{ [COLUMN_ATTR]: "" }}
        style={{
          position: "absolute",
          left: COLUMN_LEFT,
          top: band.top,
          width: COLUMN_WIDTH,
          height: band.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: JUSTIFY[settings.textPosition],
        }}
      >
        <div {...{ [CONTENT_ATTR]: "" }} style={{ [FIT_VARIABLE]: 1 } as CSSProperties}>
          {page.title.trim() && (
            <div
              style={{
                fontFamily: cormorant.style.fontFamily,
                fontWeight: SECTION_STYLE.title.weight,
                fontSize: scaled(SECTION_STYLE.title.size),
                lineHeight: SECTION_STYLE.title.lineHeight,
                letterSpacing: "0.01em",
                whiteSpace: "pre-wrap",
                color,
                textShadow,
              }}
            >
              {page.title}
            </div>
          )}

          {page.topText.trim() && (
            <div
              style={{
                marginTop: page.title.trim() ? scaled(SECTION_GAP.afterTitle) : 0,
              }}
            >
              <RichText
                value={page.topText}
                size={SECTION_STYLE.body.size}
                weight={SECTION_STYLE.body.weight}
                lineHeight={SECTION_STYLE.body.lineHeight}
                color={color}
                textShadow={textShadow}
                accent={accent}
              />
            </div>
          )}

          {hasUpper && hasLower && (
            <div
              style={{
                marginTop: scaled(SECTION_GAP.aroundOrnament),
                marginBottom: scaled(SECTION_GAP.aroundOrnament),
                opacity: settings.textTone === "acik" ? 0.85 : 1,
              }}
            >
              <Ornament width={COLUMN_WIDTH} />
            </div>
          )}

          {page.middleText.trim() && (
            <RichText
              value={page.middleText}
              size={SECTION_STYLE.body.size}
              weight={SECTION_STYLE.body.weight}
              lineHeight={SECTION_STYLE.body.lineHeight}
              color={color}
              textShadow={textShadow}
              accent={accent}
            />
          )}

          {page.bottomText.trim() && (
            <div
              style={{
                marginTop: page.middleText.trim()
                  ? scaled(SECTION_GAP.beforeBottom)
                  : 0,
              }}
            >
              <RichText
                value={page.bottomText}
                size={SECTION_STYLE.bottom.size}
                weight={SECTION_STYLE.bottom.weight}
                lineHeight={SECTION_STYLE.bottom.lineHeight}
                color={color}
                textShadow={textShadow}
                accent={accent}
              />
            </div>
          )}
        </div>
      </div>

      {FOOTER_LABEL && (
        <div
          style={{
            position: "absolute",
            left: COLUMN_LEFT,
            bottom: FOOTER_OFFSET[settings.format],
            width: COLUMN_WIDTH,
            fontFamily: inter.style.fontFamily,
            fontSize: 26,
            letterSpacing: "0.12em",
            lineHeight: 1.2,
            color,
            textShadow,
            opacity: 0.85,
          }}
        >
          {FOOTER_LABEL}
        </div>
      )}
    </div>
  );
}
