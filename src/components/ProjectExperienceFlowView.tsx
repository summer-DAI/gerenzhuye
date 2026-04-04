import Link from "next/link";

import { FlowStageIcon } from "@/components/flow-stage-icons";
import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import {
  groupProjectExperienceByFlowStage,
  loadProjectExperienceFlowMeta,
  loadProjects,
  visibleProjectExperience,
} from "@/lib/content";
import type { Project, TransactionFlowStage } from "@/types/content";

/** 与全链路 projectExperience 顺序对齐的全局编号（灰框 [n]） */
function projectStableKey(p: Project): string {
  return p.slug ?? `${p.href}::${p.title}`;
}

function globalProjectNumber(
  ordered: Project[],
  p: Project,
): number | null {
  const k = projectStableKey(p);
  const idx = ordered.findIndex((x) => projectStableKey(x) === k);
  return idx >= 0 ? idx + 1 : null;
}

function projectAnchorId(project: Project): string {
  if (project.slug) return `p-${project.slug}`;
  return `p-${encodeURIComponent(project.title).slice(0, 32)}`;
}

function FlowStageMiniCard({ project }: { project: Project }) {
  const anchor = projectAnchorId(project);
  const textBlock = (
    <>
      <h4 className="font-display text-base font-bold leading-snug text-foreground">
        {project.title}
      </h4>
      <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
    </>
  );

  return (
    <article
      id={anchor}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-border/70 bg-card/90 shadow-chunky-sm transition hover:border-accent/30 hover:shadow-md"
    >
      {project.href.startsWith("/") ? (
        <Link
          href={project.href}
          className="block p-4 pb-2 transition hover:bg-accent/[0.04]"
        >
          {textBlock}
        </Link>
      ) : (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 pb-2 transition hover:bg-accent/[0.04]"
        >
          {textBlock}
        </a>
      )}
      {project.image ? (
        <div className="px-4 pb-4">
          <ProjectImageLightbox src={project.image} alt={project.title} />
        </div>
      ) : null}
    </article>
  );
}

export function ProjectExperienceFlowView() {
  const projectExperience = visibleProjectExperience(loadProjects().projectExperience);
  const flowMeta = loadProjectExperienceFlowMeta();
  const byStage = groupProjectExperienceByFlowStage(projectExperience);

  const stageOrder: TransactionFlowStage[] = [
    "order",
    "fulfillment",
    "afterSales",
  ];

  return (
    <div>
      <section
        id="flow-overview"
        aria-labelledby="flow-strip-heading"
        className="mb-12 scroll-mt-24"
      >
        <h2 id="flow-strip-heading" className="sr-only">
          京东零售黄金流程：下单、履约、售后三环节
        </h2>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between lg:gap-4">
          {flowMeta.stages.map((stage, idx) => {
            const stageProjects = byStage[stage.id];
            const icons = stage.icons ?? [];
            const mockLines = stage.mockProjectLines ?? [];
            const useReal = stageProjects.length > 0;

            return (
              <div key={stage.id} className="flex min-w-0 flex-1 items-stretch gap-2">
                <div className="flex min-w-0 flex-1 flex-col rounded-3xl border-2 border-border bg-card/90 p-4 shadow-chunky-sm">
                  {icons.length > 0 ? (
                    <div
                      className="flex w-full min-h-[3.25rem] items-center sm:min-h-[3.75rem] md:min-h-[4.25rem]"
                      aria-hidden
                    >
                      {icons.map((tok, i) => (
                        <span key={`${stage.id}-ic-${i}`} className="contents">
                          {i > 0 ? (
                            <span className="shrink-0 px-0.5 text-lg font-bold text-muted/45 sm:px-1 sm:text-xl md:text-2xl">
                              →
                            </span>
                          ) : null}
                          <div className="flex min-w-0 flex-1 basis-0 items-center justify-center py-1">
                            <FlowStageIcon token={tok} />
                          </div>
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <h3 className="font-display mt-3 text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl md:text-[1.65rem]">
                    {stage.title}
                  </h3>
                  {stage.functionScope ? (
                    <p className="mt-1 text-sm font-semibold leading-snug text-foreground/90">
                      {stage.functionScope}
                    </p>
                  ) : null}
                  <div className="mt-3 rounded-2xl border border-accent/25 bg-accent/[0.16] p-3.5 shadow-inner dark:border-accent/35 dark:bg-accent/[0.28]">
                    <ul className="space-y-2 text-sm leading-snug text-foreground/90">
                      {useReal
                        ? stageProjects.map((p) => {
                            const n = globalProjectNumber(projectExperience, p);
                            return (
                              <li key={projectStableKey(p)}>
                                <span className="font-mono font-semibold text-muted">
                                  [{n ?? "?"}]
                                </span>{" "}
                                {p.title}
                              </li>
                            );
                          })
                        : mockLines.length > 0
                          ? mockLines.map((line, mi) => (
                              <li key={`${stage.id}-mock-${mi}`}>
                                <span className="font-mono font-semibold text-muted">
                                  [{mi + 1}]
                                </span>{" "}
                                {line}
                              </li>
                            ))
                          : (
                              <li className="text-muted">暂无项目</li>
                            )}
                    </ul>
                  </div>
                </div>
                {idx < flowMeta.stages.length - 1 ? (
                  <div
                    className="hidden shrink-0 items-center self-center text-2xl font-bold text-muted/50 lg:flex"
                    aria-hidden
                  >
                    →
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {projectExperience.length > 0 ? (
        <section
          aria-labelledby="flow-mini-cards-heading"
          className="scroll-mt-20 border-t border-border/50 pt-10"
        >
          <h2
            id="flow-mini-cards-heading"
            className="font-display mb-6 text-lg font-extrabold text-foreground"
          >
            项目卡片
          </h2>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-0 lg:divide-x lg:divide-border/55">
            {stageOrder.map((stageId) => {
              const list = byStage[stageId];
              const stageDef = flowMeta.stages.find((s) => s.id === stageId);
              const title = stageDef?.title ?? stageId;

              return (
                <div
                  key={stageId}
                  className="min-w-0 space-y-4 border-b border-border/45 pb-10 last:border-b-0 last:pb-0 lg:border-b-0 lg:px-5 lg:pb-0 first:lg:pl-0 last:lg:pr-0"
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    {title}
                  </p>
                  {list.length > 0 ? (
                    <div className="space-y-4">
                      {list.map((p) => (
                        <FlowStageMiniCard key={projectStableKey(p)} project={p} />
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-dashed border-border/60 bg-muted/20 px-3 py-6 text-center text-sm text-muted">
                      本环节暂无可见项目
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {projectExperience.length === 0 ? (
        <p className="text-muted">暂无项目，请在 content/projects.json 中配置 projectExperience。</p>
      ) : null}
    </div>
  );
}
