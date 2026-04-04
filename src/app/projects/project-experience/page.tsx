import type { Metadata } from "next";
import Link from "next/link";

import { ProjectExperienceFlowView } from "@/components/ProjectExperienceFlowView";
import { loadProjectExperienceFlowMeta } from "@/lib/content";

export function generateMetadata(): Metadata {
  const flow = loadProjectExperienceFlowMeta();
  return {
    title: flow.pageTitle,
    description: flow.pageSubtitle,
  };
}

const back =
  "inline-flex items-center gap-1 rounded-full border-2 border-border bg-card px-3 py-1.5 text-sm font-bold text-muted shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent";

export default function ProjectExperiencePage() {
  const flowMeta = loadProjectExperienceFlowMeta();

  return (
    <>
      <Link href="/" className={back}>
        ← 返回首页
      </Link>
      <h1 className="font-display mt-6 text-3xl font-extrabold tracking-tight text-foreground">
        {flowMeta.pageTitle}
      </h1>
      <p className="mt-3 max-w-none leading-relaxed text-muted">
        {flowMeta.pageSubtitle}
      </p>
      <div className="mt-10">
        <ProjectExperienceFlowView />
      </div>
    </>
  );
}
