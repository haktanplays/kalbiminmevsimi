"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface CategoryFilterProps {
  categories: Category[];
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname();

  const tabs = [
    { label: "Tümü", href: "/yazilar" },
    ...categories.map((cat) => ({
      label: cat.name,
      href: `/${cat.slug}`,
    })),
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-colors",
            pathname === tab.href
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
