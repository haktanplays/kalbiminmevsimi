"use client";

import { useRef } from "react";
import { COLORS } from "../_lib/config";
import type { BackgroundItem } from "../_lib/types";

/**
 * §5.1 — horizontally scrolling background picker. The first item is always
 * the "＋ Fotoğraf" button; the selected thumbnail carries a 2px accent ring.
 */
export function BackgroundStrip({
  items,
  selectedId,
  busy,
  onSelect,
  onPick,
}: {
  items: BackgroundItem[];
  selectedId: string | null;
  busy: boolean;
  onSelect: (id: string) => void;
  onPick: (file: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <div className="flex items-center gap-3 pb-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-[72px] w-[72px] shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed text-[11px] leading-tight disabled:opacity-50"
          style={{ borderColor: COLORS.divider, color: COLORS.secondary }}
        >
          {busy ? (
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          ) : (
            <>
              <span className="text-lg leading-none">＋</span>
              <span>Fotoğraf</span>
            </>
          )}
          <span className="sr-only">Fotoğraf ekle</span>
        </button>

        {items.map((item) => {
          const isSelected = item.id === selectedId;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-label={item.isSample ? "Örnek fotoğraf" : "Fotoğraf"}
              aria-pressed={isSelected}
              className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl"
              style={{
                outline: isSelected ? `2px solid ${COLORS.accent}` : "none",
                outlineOffset: 2,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.url}
                alt=""
                className="h-full w-full object-cover"
              />
              {item.isSample && (
                <span
                  className="absolute inset-x-0 bottom-0 bg-black/45 py-0.5 text-center text-[10px] text-white"
                  aria-hidden="true"
                >
                  örnek
                </span>
              )}
            </button>
          );
        })}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset so picking the same file twice still fires a change event.
          event.target.value = "";
          if (file) onPick(file);
        }}
      />
    </div>
  );
}
