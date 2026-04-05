"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navBase = [
  { href: "/", label: "首页", isHash: false },
  { href: "/#experience", label: "经历", isHash: true },
  { href: "/ask", label: "问我", isHash: false },
] as const;

type ActiveKey = "home" | "experience" | "projects" | "ask";

function navItemActive(
  pathname: string,
  activeKey: ActiveKey,
  item: { href: string; label: string }
): boolean {
  if (item.href === "/ask") return pathname === "/ask" || activeKey === "ask";
  if (pathname !== "/") return false;
  if (item.href === "/") return activeKey === "home";
  if (item.href === "/#experience") return activeKey === "experience";
  if (item.label === "作品") return activeKey === "projects";
  return false;
}

export function SiteHeader({
  siteBrand,
  worksHref,
}: {
  siteBrand: string;
  /** 首页「作品」锚点：有项目经历时指向 #project-experience，否则 #vibe */
  worksHref: string;
}) {
  const nav = [
    ...navBase.slice(0, 2),
    { href: worksHref, label: "作品", isHash: true },
    ...navBase.slice(2),
  ];
  const pathname = usePathname();
  const [activeKey, setActiveKey] = useState<ActiveKey>("home");

  useEffect(() => {
    const applyNav = (next: ActiveKey) => {
      setActiveKey((prev) => (prev === next ? prev : next));
    };

    const syncHash = () => {
      const h = typeof window !== "undefined" ? window.location.hash : "";
      if (pathname === "/") {
        if (h === "#experience") applyNav("experience");
        else if (
          h === "#vibe" ||
          h === "#architecture" ||
          h === "#project-experience"
        ) {
          applyNav("projects");
        } else applyNav("home");
      }
    };

    const setupObserver = () => {
      if (pathname !== "/") return () => {};
      const elements = [
        document.getElementById("experience"),
        document.getElementById("vibe"),
        document.getElementById("architecture"),
        document.getElementById("project-experience"),
      ].filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return () => {};

      let raf = 0;
      const io = new IntersectionObserver(
        (entries) => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(() => {
            const visible = entries
              .filter((e) => e.isIntersecting)
              .sort(
                (a, b) =>
                  (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
              )[0];

            const id = visible?.target?.id;
            if (id === "experience") applyNav("experience");
            else if (
              id === "vibe" ||
              id === "architecture" ||
              id === "project-experience"
            ) {
              applyNav("projects");
            } else if (window.scrollY < 200) {
              applyNav("home");
            }
          });
        },
        { root: null, threshold: [0.2, 0.35, 0.5] }
      );

      elements.forEach((el) => io.observe(el));
      return () => {
        cancelAnimationFrame(raf);
        io.disconnect();
      };
    };

    syncHash();
    const cleanupObserver = setupObserver();
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      cleanupObserver();
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-border/80 bg-background/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-2xl px-2 py-1.5 text-sm font-bold tracking-tight text-foreground transition hover:bg-border/30 hover:shadow-chunky-sm"
        >
          <span aria-hidden className="text-lg">
            ⌂
          </span>
          <span className="hidden font-display sm:inline">{siteBrand}</span>
          <span className="font-display sm:hidden">主页</span>
        </Link>
        <nav className="hidden items-center gap-1.5 sm:flex">
          {nav.map((item) => {
            const active = navItemActive(pathname, activeKey, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all duration-200 ${
                  active
                    ? "bg-accent text-accent-foreground shadow-chunky-sm"
                    : "text-muted hover:scale-[1.03] hover:bg-border/40 hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
