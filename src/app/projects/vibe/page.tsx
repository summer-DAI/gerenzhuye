import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";
import { loadProjects } from "@/lib/content";

export const metadata = {
  title: "Vibe Coding · 作品",
  description: "产品与 AI 工具相关作品",
};

export default function VibeCodingPage() {
  const { vibeCoding } = loadProjects();

  return (
    <>
      <Link
        href="/"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        ← 返回首页
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        Vibe Coding
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">
        产品与 AI 工具相关作品，与首页「Vibe Coding」区块一致。
      </p>
      <div className="mt-10">
        <ProjectGrid projects={vibeCoding} />
      </div>
    </>
  );
}
