"use client";

import { COLORS, MAX_PAGES } from "../_lib/config";
import { isPageEmpty, type Page } from "../_lib/types";

/**
 * §5.1 — page selector under the preview: `1 · 2 · 3 · ＋`.
 * A page whose body is still empty carries a red dot.
 */
export function PageChips({
  pages,
  activeIndex,
  onSelect,
  onAdd,
}: {
  pages: Page[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onAdd: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {pages.map((page, index) => {
        const isActive = index === activeIndex;
        const isEmpty = isPageEmpty(page);
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`${index + 1}. sayfa`}
            aria-current={isActive ? "true" : undefined}
            className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-medium transition-opacity"
            style={{
              borderColor: COLORS.accent,
              backgroundColor: isActive ? COLORS.accent : "transparent",
              color: isActive ? "#FFFFFF" : COLORS.accent,
            }}
          >
            {index + 1}
            {isEmpty && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 h-2 w-2 rounded-full"
                style={{ backgroundColor: "#C0392B" }}
              />
            )}
          </button>
        );
      })}

      {pages.length < MAX_PAGES && (
        <button
          type="button"
          onClick={onAdd}
          aria-label="Sayfa ekle"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed text-lg transition-opacity"
          style={{ borderColor: COLORS.divider, color: COLORS.secondary }}
        >
          ＋
        </button>
      )}
    </div>
  );
}
