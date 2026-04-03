import type { ReactNode } from "react";

function renderInline(text: string): ReactNode {
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const href = m[2];
    parts.push(
      <a
        key={`lnk-${m.index}-${k++}`}
        href={href}
        className="text-[var(--accent)] underline underline-offset-2 hover:opacity-90"
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) {
    parts.push(text.slice(last));
  }
  return parts.length ? <>{parts}</> : text;
}

/** 轻量 Markdown 子集：## 标题、- 列表（支持 - [文字](链接)）、段落内链 */
export function MarkdownBody({ text }: { text: string }) {
  const lines = text.replace(/\r\n/g, "\n").trim().split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push(
        <h2
          key={key++}
          className="mt-8 text-lg font-bold tracking-tight text-[var(--foreground)] first:mt-0"
        >
          {line.slice(3)}
        </h2>
      );
      i += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2));
        i += 1;
      }
      blocks.push(
        <ul
          key={key++}
          className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-relaxed text-[var(--muted)]"
        >
          {items.map((t, idx) => (
            <li key={idx}>{renderInline(t)}</li>
          ))}
        </ul>
      );
      continue;
    }
    const para: string[] = [line];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("- ")
    ) {
      para.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p
        key={key++}
        className="mt-3 text-sm leading-relaxed text-[var(--muted)] first:mt-0"
      >
        {renderInline(para.join(" "))}
      </p>
    );
  }

  return <div className="max-w-2xl">{blocks}</div>;
}
