"use client";

import { Container } from "@/components/shared/container";

const technologies = [
  "Next.js 14",
  "Google Gemini",
  "Supabase",
  "TypeScript",
  "Framer Motion",
  "Tailwind CSS",
  "Vercel",
  "ShadCN UI",
];

export function LogoMarquee() {
  const items = [...technologies, ...technologies];

  return (
    <section className="border-y border-cyan-500/[0.06] bg-cyan-500/[0.02] py-8">
      <Container>
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.25em] text-[#94A3B8]">
          Powered by modern stack
        </p>
      </Container>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#08111B] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#08111B] to-transparent" />
        <div className="flex animate-marquee gap-4 whitespace-nowrap">
          {items.map((tech, i) => (
            <span
              key={`${tech}-${i}`}
              className="inline-flex items-center rounded-full border border-cyan-500/10 bg-white/[0.02] px-5 py-2 text-sm font-medium text-[#94A3B8] backdrop-blur-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
