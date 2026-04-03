import Link from "next/link";

import { ProjectGrid } from "@/components/ProjectGrid";
import { loadProjects } from "@/lib/content";

export const metadata = {
  title: "项目经历 · 作品",
  description: "实习与项目经历类作品",
};

const back =
  "inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent";

export default function ProjectExperiencePage() {
  const { projectExperience } = loadProjects();

  return (
    <>
      <Link href="/" className={back}>
        ← 返回首页
      </Link>
      <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
        项目经历
      </h1>
      <p className="mt-3 max-w-2xl leading-relaxed text-muted">
        与实习、课题、团队协作相关的项目展示（与上方「经历」时间轴互补，更偏作品与产出）。
      </p>
      <div className="mt-10">
        {projectExperience.length === 0 ? (
          <p className="text-muted">暂无项目，之后会在主页同步更新。</p>
        ) : (
          <ProjectGrid projects={projectExperience} />
        )}
      </div>
    </>
  );
}
