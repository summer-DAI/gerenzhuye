import type { Profile } from "@/types/content";

export function About({ profile }: { profile: Profile }) {
  return (
    <section
      id="about"
      className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display mb-6 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          关于
        </h2>
        <p className="max-w-3xl whitespace-pre-wrap leading-relaxed text-muted">
          {profile.bio}
        </p>
        {profile.phone || (profile.showEmail && profile.email) ? (
          <div className="mt-6 flex flex-col gap-2 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-8">
            {profile.phone ? (
              <p>
                手机：{" "}
                <a
                  href={`tel:${profile.phone.replace(/\s/g, "")}`}
                  className="font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {profile.phone}
                </a>
              </p>
            ) : null}
            {profile.showEmail && profile.email ? (
              <p>
                邮箱：{" "}
                <a
                  href={`mailto:${profile.email}`}
                  className="font-semibold text-accent underline-offset-4 hover:underline"
                >
                  {profile.email}
                </a>
              </p>
            ) : null}
          </div>
        ) : null}
        {profile.links.length > 0 ? (
          <ul className="mt-8 flex flex-wrap gap-3">
            {profile.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border-2 border-border bg-card px-4 py-2 text-sm font-bold text-foreground shadow-chunky-sm transition hover:-translate-y-0.5 hover:border-accent hover:text-accent hover:shadow-chunky"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
