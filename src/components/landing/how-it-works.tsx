"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/landing/section-header";

const steps = [
  {
    step: "01",
    title: "Sign up in seconds",
    description:
      "Supabase auth with email — frictionless entry for judges and users alike.",
    tag: "Auth",
  },
  {
    step: "02",
    title: "5-step onboarding",
    description:
      "Transport, diet, energy, shopping, travel — five taps to a complete profile.",
    tag: "Onboarding",
  },
  {
    step: "03",
    title: "Meet your Carbon Twin",
    description:
      "Gemini generates your twin with footprint score, personality, and avatar.",
    tag: "AI Generation",
  },
  {
    step: "04",
    title: "Explore & simulate",
    description:
      "Dashboard, future simulator, time machine, and receipt scanner — all live.",
    tag: "Dashboard",
  },
  {
    step: "05",
    title: "Twin Speaks insights",
    description:
      "Your twin narrates personalized tips and celebrates every carbon win.",
    tag: "Narration",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-white/5 bg-secondary/30 py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-radial-glow opacity-50" />
      <Container className="relative">
        <SectionHeader
          eyebrow="How It Works"
          title={
            <>
              Demo-ready in{" "}
              <span className="text-gradient">under 3 minutes</span>
            </>
          }
          description="A fast, polished flow built for hackathon judges — from landing to AI-powered dashboard without dead ends."
        />

        <div className="relative mt-20">
          <div className="absolute left-[1.65rem] top-4 hidden h-[calc(100%-2rem)] w-px bg-gradient-to-b from-primary/60 via-primary/20 to-transparent md:left-1/2 md:block md:-translate-x-px" />

          <div className="space-y-6 md:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`relative flex flex-col gap-4 pb-10 md:flex-row md:items-center md:gap-0 md:pb-16 ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 md:px-10">
                  <div
                    className={`glass rounded-2xl p-6 ${
                      index % 2 === 1 ? "md:ml-auto" : "md:mr-auto"
                    } max-w-md`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-medium text-primary">
                        {step.step}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-xl font-semibold">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mx-6 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-primary/30 bg-card font-display text-lg font-bold text-primary shadow-lg shadow-primary/10 md:mx-0">
                  {step.step}
                </div>

                <div className="hidden flex-1 md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
