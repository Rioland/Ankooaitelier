import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "../Reveal";

export default function SectionHeading({ eyebrow, title, href, cta = "View all" }: { eyebrow?: string; title: string; href?: string; cta?: string }) {
  return (
    <Reveal className="mb-10 flex items-end justify-between gap-6">
      <div>
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-brand-600">{eyebrow}</p>}
        <h2 className="font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="group hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700 sm:flex">
          <span className="link-underline">{cta}</span>
          <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </Reveal>
  );
}
