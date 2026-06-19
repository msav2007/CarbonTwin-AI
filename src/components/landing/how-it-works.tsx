"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/landing/section-header";

const steps = [
  {
    step: "01",
    title: "Tell us how you live",
    description:
      "Five quick choices — transport, diet, energy, shopping, travel. No spreadsheets, no guilt.",
    tag: "60 seconds",
    outcome: "Lifestyle profile mapped",
  },
  {
    step: "02",
    title: "Gemini births your twin",
    description:
      "AI generates a named carbon twin with personality, footprint score, and a visual carbon signature.",
    tag: "AI Magic",
    outcome: "4.1t footprint revealed",
  },
  {
    step: "03",
    title: "See your future self",
    description:
      "Project emissions 1, 5, or 10 years ahead. Rewind choices in the What-If Time Machine.",
    tag: "Simulator",
    outcome: "2030 forecast: 3.2t",
  },
  {
    step: "04",
    title: "Scan. Speak. Save.",
    description:
      "Photograph a receipt for instant carbon breakdown. Your twin narrates what to do next.",
    tag: "Multimodal",
    outcome: "847kg avg. savings found",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-white/[0.04] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-secondary/40 via-transparent to-secondary/40" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Your Journey"
          title={
            <>
              From invisible emissions to{" "}
              <span className="text-gradient">visible action</span>
            </>
          }
          description="Four acts. Three minutes. One twin that changes how you see your carbon life."
        />

        <div className="relative mt-16 grid gap-5 sm:grid-cols-2">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:border-primary/20 hover:bg-white/[0.04] sm:p-7"
            >
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-all group-hover:bg-primary/10" />

              <div className="relative flex items-start justify-between">
                <span className="font-display text-4xl font-bold text-white/[0.06] transition-colors group-hover:text-primary/15">
                  {step.step}
                </span>
                <span className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
                  {step.tag}
                </span>
              </div>

              <h3 className="relative mt-4 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              <div className="relative mt-5 flex items-center gap-2 border-t border-white/[0.05] pt-4">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary/90">
                  {step.outcome}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
