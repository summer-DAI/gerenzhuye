import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";
import { loadProjects } from "@/lib/content";

export const metadata = {
  title: "Vibe Coding · 作品",
  description: "产品与 AI 工具相关作品",
};

const back =
  "inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent";

export default function VibeCodingPage() {
  const { vibeCoding } = loadProjects();

  return (
    <>
      <Link href="/" className={back}>
        ← 返回首页
      </Link>
      <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
        Vibe Coding
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        产品与 AI 工具相关作品，与首页「Vibe Coding」区块一致。
      </p>
      <div className="mt-10">
        <ProjectGrid projects={vibeCoding} />
      </div>
    </>
  );
}
