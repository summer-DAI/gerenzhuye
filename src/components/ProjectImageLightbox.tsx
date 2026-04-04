"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** 缩略图按钮额外 class（默认带圆角；首页大卡片可传 `rounded-none`） */
  className?: string;
};

type ViewMode = "fit" | "original";

/**
 * 缩略图 + 全屏查看：默认适应屏幕整图展示；可切换「原图 1:1」滚动查看细节
 */
export function ProjectImageLightbox({
  src,
  alt,
  className = "rounded-xl",
}: Props) {
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>("fit");
  /** 站内静态资源不走图片优化，避免 PNG 设计稿被二次压缩 */
  const isLocalAsset = src.startsWith("/");

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  useEffect(() => {
    if (open) setViewMode("fit");
  }, [open, src]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group/img relative block w-full cursor-zoom-in overflow-hidden bg-border/25 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-accent ${className}`}
        aria-label={`放大查看：${alt}`}
      >
        <span className="relative block aspect-[16/10] w-full">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-contain transition-transform duration-300 group-hover/img:scale-[1.02]"
            quality={100}
            priority={false}
            unoptimized={isLocalAsset}
          />
        </span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[rgba(0,0,0,0.92)]"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
            <p className="text-xs text-white/55 sm:text-sm">
              {viewMode === "fit"
                ? "已适应屏幕 · 可切换「原图」查看细节"
                : "原图尺寸 · 可滚动查看"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                  viewMode === "fit"
                    ? "bg-white text-black"
                    : "border border-white/30 text-white hover:bg-white/10"
                }`}
                onClick={() => setViewMode("fit")}
              >
                适应屏幕
              </button>
              <button
                type="button"
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition sm:text-sm ${
                  viewMode === "original"
                    ? "bg-white text-black"
                    : "border border-white/30 text-white hover:bg-white/10"
                }`}
                onClick={() => setViewMode("original")}
              >
                原图 1:1
              </button>
              <button
                type="button"
                className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-sm font-bold text-white transition hover:bg-white/20"
                onClick={close}
              >
                关闭
              </button>
            </div>
          </div>

          {viewMode === "fit" ? (
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto p-4 sm:p-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="h-auto max-h-[calc(100dvh-5.5rem)] w-auto max-w-[min(100%,calc(100vw-2rem))] object-contain shadow-2xl"
                draggable={false}
                decoding="async"
              />
            </div>
          ) : (
            <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
              <div className="flex min-h-full w-max min-w-full items-center justify-center p-4 pb-10 sm:p-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={alt}
                  className="h-auto w-auto max-h-none max-w-none shadow-2xl"
                  draggable={false}
                  decoding="async"
                />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
}
