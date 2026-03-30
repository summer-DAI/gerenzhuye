export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-10 text-center text-sm text-[var(--muted)]">
      <p>© {new Date().getFullYear()} 个人主页 · 内容由仓库 content 目录配置</p>
    </footer>
  );
}
