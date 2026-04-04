import Link from "next/link";

import { ExperienceSection } from "@/components/ExperienceSection";
import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import {
  loadExperience,
  loadProfile,
  loadProjectExperienceFlowMeta,
  loadProjects,
  visibleProjectExperience,
} from "@/lib/content";
import { worksListRoutes } from "@/lib/siteRoutes";

const sectionLinkClass =
  "inline-flex w-fit items-center gap-1 rounded-full border-2 border-accent/40 bg-accent/10 px-4 py-2 text-sm font-bold text-accent transition hover:-translate-y-0.5 hover:border-accent hover:bg-accent/15 hover:shadow-chunky-sm";

export default function HomePage() {
  const profile = loadProfile();
  const { vibeCoding, architecture, projectExperience: projectExperienceRaw } =
    loadProjects();
  const projectExperience = visibleProjectExperience(projectExperienceRaw);
  const flowExperienceMeta = loadProjectExperienceFlowMeta();
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
          className="scroll-mt-20 border-t-2 border-border/70 px-4 py-16 sm:px-6 sm:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                  项目经历
                </h2>
                <p className="mt-2 text-muted">实习工作产出</p>
              </div>
              <Link
                href={worksListRoutes.projectExperience}
                className={sectionLinkClass}
              >
                去看看 →
              </Link>
            </div>
            <Link
              href={worksListRoutes.projectExperience}
              className="group block overflow-hidden rounded-3xl border-2 border-border bg-card p-6 shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent/35 hover:shadow-chunky sm:p-8"
            >
              <p className="font-display text-lg font-bold text-foreground group-hover:text-accent sm:text-xl">
                {flowExperienceMeta.pageTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                {flowExperienceMeta.pageSubtitle}
              </p>
              <p className="mt-5 text-sm font-bold text-accent">
                查看下单 · 履约 · 售后环节与项目详情 →
              </p>
            </Link>
          </div>
        </section>
      ) : null}

      <section
        id="vibe"
        className="scroll-mt-20 border-t-2 border-border/70 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                Vibe Coding
              </h2>
              <p className="mt-2 text-muted">产品与 AI 工具相关作品。</p>
            </div>
            <Link href={worksListRoutes.vibeCoding} className={sectionLinkClass}>
              去看看 →
            </Link>
          </div>
          <ProjectGrid projects={vibeCoding} />
        </div>
      </section>

      <section
        id="architecture"
        className="scroll-mt-20 border-t-2 border-border/70 px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
                建筑设计
              </h2>
              <p className="mt-2 text-muted">
                建筑与空间设计作品；每个项目都有站内详情页。
              </p>
            </div>
            <Link href={worksListRoutes.architecture} className={sectionLinkClass}>
              去看看 →
            </Link>
          </div>
          <ProjectGrid projects={architecture} />
        </div>
      </section>
    </>
  );
}
