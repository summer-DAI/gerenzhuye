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
  const { vibeCoding, architecture, projectExperience } = loadProjects();
  const { items } = loadExperience();

  return (
    <>
      <Hero
        profile={profile}
        showProjectExperienceLink={projectExperience.length > 0}
      />
      <ExperienceSection items={items} />

      {projectExperience.length > 0 ? (
        <section
          id="project-experience"
          className="scroll-mt-20 border-t border-[var(--border)] px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                  项目经历
                </h2>
                <p className="mt-2 text-[var(--muted)]">
                  实习与课题等偏「项目产出」的展示。
                </p>
              </div>
              <Link
                href="/projects/project-experience"
                className="w-fit text-sm font-semibold text-[var(--accent)] transition hover:underline"
              >
                独立页面 →
              </Link>
            </div>
            <ProjectGrid projects={projectExperience} />
          </div>
        </section>
      ) : null}

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
                产品与 AI 工具相关作品。
              </p>
            </div>
            <Link
              href="/projects/vibe"
              className="w-fit text-sm font-semibold text-[var(--accent)] transition hover:underline"
            >
              独立页面 →
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
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-3xl">
                建筑设计
              </h2>
              <p className="mt-2 text-[var(--muted)]">
                建筑与空间设计作品；每个项目有独立详情页。
              </p>
            </div>
            <Link
              href="/projects/architecture"
              className="w-fit text-sm font-semibold text-[var(--accent)] transition hover:underline"
            >
              独立页面 →
            </Link>
          </div>
          <ProjectGrid projects={architecture} />
        </div>
      </section>
    </>
  );
}
