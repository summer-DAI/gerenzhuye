import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";
import { loadProjects } from "@/lib/content";

export const metadata = {
  title: "项目经历 · 作品",
  description: "实习与项目经历类作品",
};

export default function ProjectExperiencePage() {
  const { projectExperience } = loadProjects();

  return (
    <>
      <Link
        href="/"
        className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
      >
        ← 返回首页
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--foreground)]">
        项目经历
      </h1>
      <p className="mt-2 max-w-2xl text-[var(--muted)]">
        与实习、课题、团队协作相关的项目展示（与上方「经历」时间轴互补，更偏作品与产出）。
      </p>
      <div className="mt-10">
        {projectExperience.length === 0 ? (
          <p className="text-[var(--muted)]">暂无项目，之后会在主页同步更新。</p>
        ) : (
          <ProjectGrid projects={projectExperience} />
        )}
      </div>
    </>
  );
}
