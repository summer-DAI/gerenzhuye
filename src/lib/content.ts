import { existsSync, readdirSync, readFileSync } from "fs";
import path from "path";

import type {
  ExperienceFile,
  Profile,
  Project,
  ProjectExperienceFlowMeta,
  ProjectsFileV2,
  TransactionFlowStage,
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
    projectExperienceFlow: data.projectExperienceFlow,
  };
}

/** 过滤 `hidden: true` 的项目经历（首页与流程页展示用） */
export function visibleProjectExperience(projects: Project[]): Project[] {
  return projects.filter((p) => !p.hidden);
}

/** 按环节分组；未标 flowStage 的条目不会出现在任一组 */
export function groupProjectExperienceByFlowStage(
  projects: Project[]
): Record<TransactionFlowStage, Project[]> {
  const out: Record<TransactionFlowStage, Project[]> = {
    order: [],
    fulfillment: [],
    afterSales: [],
  };
  for (const p of projects) {
    const s = p.flowStage;
    if (s === "order" || s === "fulfillment" || s === "afterSales") {
      out[s].push(p);
    }
  }
  return out;
}

export function loadProjectExperienceFlowMeta(): ProjectExperienceFlowMeta {
  const flow = loadProjects().projectExperienceFlow;
  if (flow?.stages?.length) return flow;
  return {
    pageTitle: "京东零售黄金流程交易方向·项目经历",
    pageSubtitle:
      "按电商黄金流程（下单 → 履约 → 售后）组织实习中的产出。请在 content/projects.json 中配置 projectExperienceFlow。",
    stages: [
      {
        id: "order",
        title: "下单阶段",
        functionScope: "",
        summary: "",
        highlights: [],
        icons: [],
        mockProjectLines: [],
      },
      {
        id: "fulfillment",
        title: "履约阶段",
        functionScope: "",
        summary: "",
        highlights: [],
        icons: [],
        mockProjectLines: [],
      },
      {
        id: "afterSales",
        title: "售后阶段",
        functionScope: "",
        summary: "",
        highlights: [],
        icons: [],
        mockProjectLines: [],
      },
    ],
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
