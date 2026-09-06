"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, PenLine } from "lucide-react";
import { COLORS } from "../_lib/config";

const TABS = [
  { href: "/smartpost", label: "Oluştur", Icon: PenLine },
  { href: "/smartpost/gecmis", label: "Geçmiş", Icon: Clock },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-10 border-t"
      style={{
        backgroundColor: COLORS.card,
        borderColor: COLORS.divider,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex w-full max-w-[520px]">
        {TABS.map(({ href, label, Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-xs"
              style={{ color: isActive ? COLORS.accent : COLORS.secondary }}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
