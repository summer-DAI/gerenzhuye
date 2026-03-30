import { readFileSync } from "fs";
import path from "path";

import type {
  ExperienceFile,
  Profile,
  ProjectsFileV2,
} from "@/types/content";

const contentDir = path.join(process.cwd(), "content");

export function loadProfile(): Profile {
  const raw = readFileSync(path.join(contentDir, "profile.json"), "utf-8");
  return JSON.parse(raw) as Profile;
}

export function loadProjects(): ProjectsFileV2 {
  const raw = readFileSync(path.join(contentDir, "projects.json"), "utf-8");
  return JSON.parse(raw) as ProjectsFileV2;
}

export function loadKnowledgeText(): string {
  return readFileSync(path.join(contentDir, "knowledge.md"), "utf-8");
}

export function loadExperience(): ExperienceFile {
  const raw = readFileSync(path.join(contentDir, "experience.json"), "utf-8");
  return JSON.parse(raw) as ExperienceFile;
}
