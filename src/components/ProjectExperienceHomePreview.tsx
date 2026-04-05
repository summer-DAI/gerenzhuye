import Image from "next/image";

import type { Project } from "@/types/content";

const THUMB_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px";

export function ProjectExperienceHomePreview({
  projects,
}: {
  projects: Project[];
}) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-6 border-t border-border/60 pt-6">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5 lg:gap-4">
        {projects.map((project) => {
          const key = project.slug ?? project.href + project.title;
          const initial = project.title.trim().slice(0, 1) || "·";

          return (
            <li key={key} className="min-w-0">
              <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-border bg-card/90 p-2 shadow-chunky-sm sm:p-2.5">
                <p className="mb-2 line-clamp-2 text-center text-xs font-bold leading-snug text-foreground sm:text-sm">
                  {project.title}
                </p>
                <div className="relative mt-auto aspect-square w-full overflow-hidden rounded-xl bg-border/25">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes={THUMB_SIZES}
                      quality={75}
                      unoptimized={project.image.startsWith("data:")}
                    />
                  ) : (
                    <span
                      className="flex h-full w-full items-center justify-center font-display text-2xl font-extrabold text-muted/50"
                      aria-hidden
                    >
                      {initial}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
