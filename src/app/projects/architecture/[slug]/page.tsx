import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchitectureImageGallery } from "@/components/ArchitectureImageGallery";
import { MarkdownBody } from "@/components/MarkdownBody";
import {
  getArchitectureGalleryImages,
  getArchitectureProjectBySlug,
  loadArchitectureMarkdown,
  loadProjects,
} from "@/lib/content";

export function generateStaticParams() {
  const { architecture } = loadProjects();
  return architecture
    .filter((p) => p.slug)
    .map((p) => ({ slug: p.slug as string }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = getArchitectureProjectBySlug(slug);
  if (!project) return { title: "建筑作品" };
  return { title: `${project.title} · 建筑设计` };
}

export default async function ArchitectureDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getArchitectureProjectBySlug(slug);
  if (!project) notFound();

  const md = loadArchitectureMarkdown(slug);
  const gallery = getArchitectureGalleryImages(slug);
  const showFallbackHero = gallery.length === 0 && Boolean(project.image);

  return (
    <>
      <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
        <Link
          href="/"
          className="transition-colors hover:text-[var(--accent)]"
        >
          ← 返回首页
        </Link>
        <span aria-hidden className="text-[var(--border)]">
          /
        </span>
        <Link
          href="/projects/architecture"
          className="transition-colors hover:text-[var(--accent)]"
        >
          建筑设计
        </Link>
      </div>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        {project.title}
      </h1>
      <p className="mt-3 max-w-2xl text-[var(--muted)]">{project.description}</p>

      {project.tags.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md bg-[var(--border)]/60 px-2 py-0.5 text-xs text-[var(--muted)]"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {showFallbackHero ? (
        <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)]/30">
          <Image
            src={project.image as string}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      <ArchitectureImageGallery images={gallery} />

      <article className="mt-10">
        {md ? (
          <MarkdownBody text={md} />
        ) : (
          <p className="text-sm text-[var(--muted)]">
            详情介绍可在内容目录中补充，保存后重新部署即可显示。
          </p>
        )}
      </article>
    </>
  );
}
