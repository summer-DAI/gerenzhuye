import Link from "next/link";

import { ProjectImageLightbox } from "@/components/ProjectImageLightbox";
import type { Project } from "@/types/content";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-muted">
        暂无作品，请在 content/projects.json 中添加。
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
      {projects.map((project) => {
        const key = project.slug ?? project.href + project.title;
        const internal = project.href.startsWith("/");
        const shellClass =
          "group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-border bg-card shadow-chunky-sm transition-all duration-200 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-chunky";

        const textBlock = (
          <div className="flex flex-1 flex-col p-5">
            <h3 className="font-display text-lg font-bold text-foreground group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            {project.tags.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-accent/12 px-3 py-1 text-xs font-semibold text-foreground dark:bg-accent/18"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );

        return (
          <li key={key}>
            <div className={`${shellClass}`}>
              {project.image ? (
                <div className="overflow-hidden rounded-t-3xl bg-border/30">
                  <ProjectImageLightbox
                    src={project.image}
                    alt={project.title}
                    className="rounded-none"
                  />
                </div>
              ) : null}
              {internal ? (
                <Link href={project.href} className="flex flex-1 flex-col">
                  {textBlock}
                </Link>
              ) : (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-1 flex-col"
                >
                  {textBlock}
                </a>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
