"use client";

import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { JourneyLink } from "@/components/shared/journey-link";
import { DEMO_HIGHLIGHTS } from "@/lib/landing/content";

export function DemoSection() {
  return (
    <section id="demo" className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] border border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c1929]/90 via-card/95 to-[#08111B]" />
          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#00D4FF]/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#3B82F6]/8 blur-3xl" />
          <div className="noise absolute inset-0" />
          <div className="absolute inset-x-0 top-0 h-px glow-line" />

          <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-4 w-4 text-primary" />
                Judge demo script
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                One complete journey.{" "}
                <span className="text-gradient">No fake features.</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                Start on the onboarding flow, reveal the twin, open the dashboard,
                and show how recommendations change the long-term trajectory.
              </p>
              <Button variant="glow" size="lg" className="mt-8" asChild>
                <JourneyLink resumeChildren="Open My Dashboard">
                  Run the Demo
                  <ArrowRight />
                </JourneyLink>
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              {DEMO_HIGHLIGHTS.map((item, i) => (
                <motion.li
                  key={item.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 rounded-xl border border-border bg-slate-50 px-5 py-4 backdrop-blur-sm transition-all hover:border-border hover:bg-slate-50"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/15 bg-primary/10 font-mono text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function CTA() {
  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[2rem] border border-border px-6 py-16 text-center sm:px-12 sm:py-24"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/[0.06] via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px glow-line" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00D4FF]/10 blur-3xl" />

          <div className="relative">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
              The future is personal
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Show judges a carbon assistant{" "}
              <span className="text-gradient">that earns trust</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              CarbonTwin turns personal habits into a profile, a reveal moment,
              a simulation, and a practical reduction plan you can act on immediately.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="glow" size="xl" asChild>
                <JourneyLink resumeChildren="Return to Dashboard">
                  Build My Twin
                  <ArrowRight />
                </JourneyLink>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <JourneyLink resumeChildren="Retake onboarding">
                  See the onboarding flow
                </JourneyLink>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
