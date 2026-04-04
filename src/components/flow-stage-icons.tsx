import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base =
  "h-11 w-11 shrink-0 text-accent sm:h-12 sm:w-12 md:h-14 md:w-14";

function IconShell({ children, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className ?? base}
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  );
}

/** 流程条单色图标：`icons` 数组中的短 key 映射到此；未知 key 显示通用占位 */
export function FlowStageIcon({ token }: { token: string }) {
  const t = token.trim().toLowerCase();

  switch (t) {
    case "cart":
      return (
        <IconShell>
          <circle cx="9" cy="20" r="1.25" />
          <circle cx="18" cy="20" r="1.25" />
          <path d="M2.5 3.5h2.2l1.8 12.2a1.5 1.5 0 0 0 1.5 1.3h9.4a1.5 1.5 0 0 0 1.5-1.1l1.6-7.4H6.2" />
        </IconShell>
      );
    case "confirm":
      return (
        <IconShell>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </IconShell>
      );
    case "chart":
      return (
        <IconShell>
          <path d="M3 3v18h18" />
          <path d="M7 16V10" />
          <path d="M12 16V6" />
          <path d="M17 16v-5" />
        </IconShell>
      );
    case "warehouse":
      return (
        <IconShell>
          <path d="M3 10.5 12 4l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-9.5z" />
          <path d="M9 21V12h6v9" />
        </IconShell>
      );
    case "truck":
      return (
        <IconShell>
          <path d="M14 18V6H3v12h3.5" />
          <path d="M14 9h3l3 4v5h-4" />
          <circle cx="7.5" cy="18.5" r="2.5" />
          <circle cx="17.5" cy="18.5" r="2.5" />
        </IconShell>
      );
    case "package":
      return (
        <IconShell>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </IconShell>
      );
    case "chat":
      return (
        <IconShell>
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </IconShell>
      );
    case "tools":
      return (
        <IconShell>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </IconShell>
      );
    case "star":
      return (
        <IconShell>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </IconShell>
      );
    case "help":
      return (
        <IconShell>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </IconShell>
      );
    default:
      return (
        <IconShell>
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h.01M12 12h.01M16 12h.01" strokeWidth={2.5} />
        </IconShell>
      );
  }
}
