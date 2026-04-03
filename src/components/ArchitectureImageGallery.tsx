import Image from "next/image";

export function ArchitectureImageGallery({ images }: { images: string[] }) {
  if (images.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
        图纸预览（图片）
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
        下列图片与 PDF 为同一套内容，便于在线浏览；需要打印或原版式可下载文末 PDF。
      </p>
      <ul className="mt-6 grid list-none gap-4 p-0 sm:grid-cols-2">
        {images.map((src) => (
          <li
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
