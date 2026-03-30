import Link from "next/link";

import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import {
  loadExperience,
  loadProfile,
  loadProjects,
} from "@/lib/content";

export default function HomePage() {
  const profile = loadProfile();
  const { vibeCoding, architecture } = loadProjects();
  const { items } = loadExperience();

  return (
    <>
      <Hero profile={profile} />
      <ExperienceSection items={items} />
      <section
        id="vibe"
        className="scroll-mt-20 border-t border-[var(--border)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                Vibe Coding
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                产品与 AI 工具相关作品（在 content/projects.json 的 vibeCoding 维护）。
              </p>
            </div>
            <Link
              href="/ask"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-orange-600"
            >
              基于知识库提问
            </Link>
          </div>
          <ProjectGrid projects={vibeCoding} />
        </div>
      </section>

      <section
        id="architecture"
        className="scroll-mt-20 border-t border-[var(--border)] px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
              建筑设计
            </h2>
            <p className="mt-2 text-[var(--muted)]">
              建筑与空间设计作品（在 content/projects.json 的 architecture 维护）。
            </p>
          </div>
          <ProjectGrid projects={architecture} />
        </div>
      </section>
    </>
  );
}
