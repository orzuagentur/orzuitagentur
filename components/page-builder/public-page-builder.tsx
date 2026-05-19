import type {
  PageBuilderBlock,
  PageBuilderSectionWithBlocks,
} from "@/lib/page-builder/types";
import Link from "next/link";

type PublicPageBuilderProps = {
  sections: PageBuilderSectionWithBlocks[];
};

export function PublicPageBuilder({ sections }: PublicPageBuilderProps) {
  if (sections.length === 0) return null;

  return (
    <div className="mt-16 space-y-10">
      {sections.map((section) => (
        <section
          key={section.id}
          id={section.section_key}
          className={`rounded-3xl border border-[var(--border)] ${backgroundClass(section.layout.background)} ${paddingClass(section.layout.paddingTop, section.layout.paddingBottom)}`}
          style={gradientStyle(section.layout.gradient)}
          data-animation={String(section.animation.preset ?? "none")}
          data-responsive={String(section.responsive.desktop ?? "wide")}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
              {section.title_de}
            </h2>
            <div className="grid gap-5">
              {section.blocks.map((block) => (
                <PublicBlock key={block.id} block={block} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

function PublicBlock({ block }: { block: PageBuilderBlock }) {
  const buttonLabel = stringSetting(block.settings, "buttonLabel");
  const buttonHref = stringSetting(block.settings, "buttonHref");

  if (block.block_type === "custom_html") {
    return (
      <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black/20">
        <iframe
          title={block.title_de}
          sandbox=""
          className="min-h-[220px] w-full bg-white"
          srcDoc={block.content_de ?? ""}
        />
      </article>
    );
  }

  if (block.block_type === "react") {
    return (
      <article className="rounded-2xl border border-dashed border-[var(--border)] p-5 text-sm text-[var(--muted)]">
        React Block: {stringSetting(block.settings, "reactKey") || block.title_de}
      </article>
    );
  }

  const paragraphs = (block.content_de ?? "")
    .split(/\n{2,}/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <article className="rounded-2xl border border-[var(--border)] bg-white/[0.025] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
        {block.block_type}
      </p>
      <h3 className="mt-2 text-xl font-semibold text-[var(--foreground)]">
        {block.title_de}
      </h3>
      {paragraphs.length > 0 ? (
        <div className="mt-4 space-y-3 text-sm leading-7 text-[var(--foreground)]/85">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      ) : null}
      {buttonLabel && buttonHref ? (
        <Link
          href={buttonHref}
          className="mt-5 inline-flex rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm font-semibold text-[var(--foreground)]"
        >
          {buttonLabel}
        </Link>
      ) : null}
    </article>
  );
}

function stringSetting(settings: Record<string, unknown>, key: string) {
  const value = settings[key];
  return typeof value === "string" ? value.trim() : "";
}

function backgroundClass(value: unknown) {
  if (value === "surface") return "bg-[var(--surface)]";
  if (value === "elevated") return "bg-[var(--surface-elevated)]";
  if (value === "dark") return "bg-black/30";
  if (value === "accent") return "bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]";
  return "bg-transparent";
}

function paddingClass(top: unknown, bottom: unknown) {
  const map: Record<string, string> = {
    none: "py-0",
    sm: "py-4",
    md: "py-6",
    lg: "py-8",
    xl: "py-12",
  };
  const topClass = map[String(top)] ?? "pt-8";
  const bottomClass = map[String(bottom)] ?? "pb-8";
  if (topClass === bottomClass) return topClass;
  return `${topClass.replace("py", "pt")} ${bottomClass.replace("py", "pb")}`;
}

function gradientStyle(value: unknown) {
  return typeof value === "string" && value.trim()
    ? { backgroundImage: value.trim() }
    : undefined;
}
