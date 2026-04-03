export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-2 border-border/70 bg-card/40 py-12 text-center text-sm text-muted">
      <p className="mx-auto max-w-lg leading-relaxed">
        © {new Date().getFullYear()} summer-dai 的个人主页 ·
        「问我」答歪了别拍砖，AI 还在长个子～
      </p>
    </footer>
  );
}
