export interface Profile {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  email?: string;
  showEmail: boolean;
  links: { label: string; href: string }[];
  /** 首行问候，如「你好，我是」 */
  greeting?: string;
  /** Hero 区深色标签内文案 */
  badge?: string;
  /** 右侧肖像图 URL */
  heroImage?: string;
  /** 顶栏左侧站点名，默认「{name} · Portfolio」 */
  brandLabel?: string;
  /** 联系电话（可选，展示在关于区） */
  phone?: string;
  /** 小红书账号（不含 @ 前缀也可） */
  xiaohongshu?: string;
  /** 小红书主页链接（可选） */
  xiaohongshuUrl?: string;
}

/** 项目经历 · 电商黄金流程环节（仅用于 projectExperience） */
export type TransactionFlowStage = "order" | "fulfillment" | "afterSales";

export interface Project {
  title: string;
  description: string;
  /** 站内路径以 `/` 开头（如 `/projects/architecture/xxx`）时用 Next Link；外链用 https */
  href: string;
  image?: string;
  /** 可选额外配图 URL（主图仍为 `image`；用于项目经历小卡片多张设计稿） */
  extraImages?: string[];
  tags: string[];
  /** 建筑类二级页 slug，与 `content/architecture/{slug}.md` 及可选 `public/architecture/{slug}/` 对应 */
  slug?: string;
  /** 仅 projectExperience：下单 / 履约 / 售后 */
  flowStage?: TransactionFlowStage;
  /** 可选：关键结果一行（流程页卡片展示） */
  resultHighlight?: string;
  /** 可选：仓库/文章等外链，不作为卡片主跳转 */
  externalUrl?: string;
  /** 仅 projectExperience：为 true 时在首页与流程页均不展示（数据可保留） */
  hidden?: boolean;
}

export interface ProjectExperienceFlowStageDef {
  id: TransactionFlowStage;
  /** 一级：环节名称，如「下单阶段」 */
  title: string;
  /** 二级：一句话概括该环节功能边界（示意图中的功能标题行） */
  functionScope?: string;
  /** 补充说明，置于二级标题与项目灰框之间（可选） */
  summary: string;
  /** 可选要点；与灰框项目列表二选一展示时可留空 */
  highlights: string[];
  /** 顶部流程示意：短 key（如 cart、warehouse），渲染为单色 SVG */
  icons?: string[];
  /** 该环节暂无真实项目时，灰框内展示的模拟行（不含 [Pn] 前缀也可） */
  mockProjectLines?: string[];
}

export interface ProjectExperienceFlowMeta {
  pageTitle: string;
  pageSubtitle: string;
  stages: ProjectExperienceFlowStageDef[];
}

export interface ProjectsFile {
  projects: Project[];
}

export interface ProjectsFileV2 {
  vibeCoding: Project[];
  architecture: Project[];
  /** 与 vibe / 建筑同级的「项目经历」类作品（实习项目、课题等） */
  projectExperience: Project[];
  /** 项目经历二级页：交易流程说明文案 */
  projectExperienceFlow?: ProjectExperienceFlowMeta;
}

export type ExperienceKind = "education" | "internship" | "campus";

export interface ExperienceItem {
  kind: ExperienceKind;
  dateRange: string;
  organization: string;
  role: string;
  /** 若设置，经历卡片职位行优先显示此文案（可与 `role` 并存以保留完整原文） */
  roleDisplay?: string;
  bullets: string[];
  /** 为 true 时不渲染要点列表（文案可保留在 bullets 内便于日后恢复） */
  hideBullets?: boolean;
  logo?: string;
  href?: string;
}

export interface ExperienceFile {
  items: ExperienceItem[];
}
