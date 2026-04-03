import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

import type {
  ExperienceFile,
  Profile,
  Project,
  ProjectsFileV2,
} from "@/types/content";

const contentDir = path.join(process.cwd(), "content");

const ARCH_IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

export function loadProfile(): Profile {
  const raw = readFileSync(path.join(contentDir, "profile.json"), "utf-8");
  return JSON.parse(raw) as Profile;
}

export function loadProjects(): ProjectsFileV2 {
  const raw = readFileSync(path.join(contentDir, "projects.json"), "utf-8");
  const data = JSON.parse(raw) as Partial<ProjectsFileV2>;
  return {
    vibeCoding: data.vibeCoding ?? [],
    architecture: data.architecture ?? [],
    projectExperience: data.projectExperience ?? [],
  };
}

export function loadKnowledgeText(): string {
  return readFileSync(path.join(contentDir, "knowledge.md"), "utf-8");
}

export function loadExperience(): ExperienceFile {
  const raw = readFileSync(path.join(contentDir, "experience.json"), "utf-8");
  return JSON.parse(raw) as ExperienceFile;
}

export function getArchitectureProjectBySlug(slug: string): Project | undefined {
  return loadProjects().architecture.find(
    (p) => p.slug === slug || p.href === `/projects/architecture/${slug}`
  );
}

/** 建筑项目详情正文（Markdown），文件缺失时返回 null */
export function loadArchitectureMarkdown(slug: string): string | null {
  try {
    return readFileSync(
      path.join(contentDir, "architecture", `${slug}.md`),
      "utf-8"
    );
  } catch {
    return null;
  }
}

/** `public/architecture/{slug}` 下所有图片的 URL（已编码文件名），按文件名排序 */
export function getArchitectureGalleryImages(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "architecture", slug);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => ARCH_IMAGE_EXT.test(f) && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "zh"))
    .map((f) => `/architecture/${slug}/${encodeURIComponent(f)}`);
}
