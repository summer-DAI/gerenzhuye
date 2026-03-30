import Image from "next/image";

import type { Project } from "@/types/content";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="text-[var(--muted)]">
        暂无作品，请在 content/projects.json 中添加。
      </p>
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:gap-8">
      {projects.map((project) => (
        <li key={project.title}>
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm transition-shadow hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-slate-900/40"
          >
            {project.image ? (
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--border)]/30">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </div>
            ) : null}
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-lg font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {project.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
                {project.description}
              </p>
              {project.tags.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-md bg-[var(--border)]/60 px-2 py-0.5 text-xs text-[var(--muted)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
