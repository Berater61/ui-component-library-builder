"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/library", label: "Bibliothek" },
  { href: "/builder", label: "Builder" },
  { href: "/builder/summary", label: "Zusammenfassung" },
  { href: "/builder/export", label: "Export" }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/") {
    return children;
  }

  return (
    <div className="app-shell">
      <aside className="surface sticky top-0 z-10 flex h-auto flex-col gap-4 border-x-0 border-t-0 px-4 py-4 lg:h-dvh lg:border-y-0 lg:border-l-0">
        <div>
          <div className="text-lg font-semibold">UI-Bibliothek</div>
          <div className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--primary)" }}>
            Aktive Weiterentwicklung
          </div>
          <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            Komponenten zu Website-Briefs
          </div>
        </div>
        <nav className="flex min-w-0 flex-wrap gap-2 lg:flex-col lg:flex-nowrap" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href === "/library" && pathname.startsWith("/library/"));
            return (
              <Link
                aria-current={active ? "page" : undefined}
                className="focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                href={item.href}
                key={item.href}
                style={active ? { background: "var(--surface-muted)", color: "var(--primary)" } : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
