"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";

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
  const [hash, setHash] = useState(() =>
    typeof window !== "undefined" ? window.location.hash : ""
  );
  const [activeKey, setActiveKey] = useState<ActiveKey>("home");

  useLayoutEffect(() => {
    setHash(typeof window !== "undefined" ? window.location.hash : "");
  }, [pathname]);

  useEffect(() => {
    const syncHash = () => {
      const h = typeof window !== "undefined" ? window.location.hash : "";
      setHash(h);
      if (pathname === "/") {
        if (h === "#experience") setActiveKey("experience");
        else if (
          h === "#vibe" ||
          h === "#architecture" ||
          h === "#project-experience"
        ) {
          setActiveKey("projects");
        } else setActiveKey("home");
      }
    };

    // 根据滚动位置自动高亮（在首页生效）
    const setupObserver = () => {
      if (pathname !== "/") return () => {};
      const elements = [
        document.getElementById("experience"),
        document.getElementById("vibe"),
        document.getElementById("architecture"),
        document.getElementById("project-experience"),
      ].filter(Boolean) as HTMLElement[];

      if (elements.length === 0) return () => {};

      const io = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort(
              (a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0)
            )[0];

          const id = visible?.target?.id;
          if (id === "experience") setActiveKey("experience");
          else if (
            id === "vibe" ||
            id === "architecture" ||
            id === "project-experience"
          ) {
            setActiveKey("projects");
          } else {
            // 都不在视口时，回到首页（首屏）
            if (window.scrollY < 200) setActiveKey("home");
          }
        },
        { root: null, threshold: [0.2, 0.35, 0.5] }
      );

      elements.forEach((el) => io.observe(el));
      return () => io.disconnect();
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
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight text-[var(--foreground)]"
        >
          <span aria-hidden className="text-base">
            ⌂
          </span>
          <span className="hidden sm:inline">{siteBrand}</span>
          <span className="sm:hidden">主页</span>
        </Link>
        <nav className="hidden items-center gap-1 sm:flex">
          {nav.map((item) => {
            const active = navItemActive(pathname, activeKey, item);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`rounded-md px-2 py-1.5 text-xs font-semibold tracking-wide transition-colors sm:px-3 ${
                  active
                    ? "text-[var(--foreground)] underline decoration-2 underline-offset-4"
                    : "text-[var(--muted)] hover:bg-[var(--border)]/30 hover:text-[var(--foreground)]"
                }`}
              >
                {item.label.toUpperCase?.() ? item.label : item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
