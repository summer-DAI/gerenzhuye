import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";
import { loadProjects } from "@/lib/content";

export const metadata = {
  title: "建筑设计 · 作品",
  description: "建筑与空间设计作品",
};

export default function ArchitecturePage() {
  const { architecture } = loadProjects();

  return (
    <>
      <Link
        href="/"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        ← 返回首页
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        建筑设计作品
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">
        建筑与空间设计相关项目，与首页「建筑设计」区块一致。
      </p>
      <div className="mt-10">
        <ProjectGrid projects={architecture} />
      </div>
    </>
  );
}
