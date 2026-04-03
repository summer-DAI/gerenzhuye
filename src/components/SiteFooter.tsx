export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)] py-10 text-center text-sm text-[var(--muted)]">
      <p>
        © {new Date().getFullYear()} summer-dai 的个人主页 ·
        「问我」答歪了别拍砖，AI 还在长个子～
      </p>
    </footer>
  );
}
