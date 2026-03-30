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

export interface Project {
  title: string;
  description: string;
  href: string;
  image?: string;
  tags: string[];
}

export interface ProjectsFile {
  projects: Project[];
}

export interface ProjectsFileV2 {
  vibeCoding: Project[];
  architecture: Project[];
}

export type ExperienceKind = "education" | "internship" | "campus";

export interface ExperienceItem {
  kind: ExperienceKind;
  dateRange: string;
  organization: string;
  role: string;
  bullets: string[];
  logo?: string;
  href?: string;
}

export interface ExperienceFile {
  items: ExperienceItem[];
}
