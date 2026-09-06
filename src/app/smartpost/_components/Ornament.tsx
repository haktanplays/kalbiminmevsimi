import { CANVAS_COLORS } from "../_lib/config";

/** §4.2 (revize) — bölümleri ayıran süslü çizgi. */
export function Ornament({ width }: { width: number }) {
  return (
    <svg
      width={width}
      height={Math.round(width * 0.05)}
      viewBox="0 0 600 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <g stroke={CANVAS_COLORS.ornament} strokeWidth="2" strokeLinecap="round">
        <path d="M4 15h214" />
        <path d="M382 15h214" />
        <path d="M232 15h28M248 9l8 6-8 6" />
        <path d="M368 15h-28M352 9l-8 6 8 6" />
      </g>
      <g fill={CANVAS_COLORS.ornament}>
        <path d="M300 4c3 6 5 9 11 11-6 2-8 5-11 11-3-6-5-9-11-11 6-2 8-5 11-11Z" />
        <circle cx="279" cy="15" r="3.5" />
        <circle cx="321" cy="15" r="3.5" />
      </g>
    </svg>
  );
}
