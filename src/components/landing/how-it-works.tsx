"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/landing/section-header";
import { HOW_IT_WORKS_STEPS } from "@/lib/landing/content";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-border py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-500/[0.02] via-transparent to-cyan-500/[0.02]" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Your Journey"
          title={
            <>
              From lifestyle signals to{" "}
              <span className="text-gradient">visible action</span>
            </>
          }
          description="A demo-ready flow that starts with your current habits and ends with a plan you can actually use."
        />

        <div className="relative mt-16 grid gap-5 sm:grid-cols-2">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl glass p-6 transition-all hover:glass-strong sm:p-7"
            >
              <div className="relative flex items-start justify-between">
                <span className="font-display step-number">
                  {step.step}
                </span>
                <span className="rounded-full border border-border bg-slate-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {step.tag}
                </span>
              </div>

              <h3 className="relative mt-4 font-display text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>

              <div className="relative mt-5 flex items-center gap-2 border-t border-border pt-4">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    'outcomeSuccess' in step && step.outcomeSuccess ? "bg-success" : "bg-primary"
                  }`}
                />
                <span
                  className={`text-xs font-medium ${
                    'outcomeSuccess' in step && step.outcomeSuccess ? "text-success" : "text-primary"
                  }`}
                >
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
