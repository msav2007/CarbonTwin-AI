"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";

const demoHighlights = [
  "AI twin with personality & footprint score",
  "Future Simulator — 1, 5, 10 year projections",
  "What-If Time Machine scenario comparisons",
  "Receipt photo → itemized carbon breakdown",
  "Twin Speaks real-time AI narration",
  "Carbon Budget Meter with live progress",
];

export function DemoSection() {
  return (
    <section id="demo" className="py-24 sm:py-32">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-primary/15">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-card to-card" />
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="noise absolute inset-0" />

          <div className="relative grid gap-12 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:p-16">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Zap className="h-4 w-4" />
                Built for judges
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                The full demo flow,{" "}
                <span className="text-gradient">zero fluff</span>
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
                We cut leaderboards, streaks, and social features. What remains
                is pure AI impact — the features that score highest in national
                hackathon judging.
              </p>
              <Button variant="glow" size="lg" className="mt-8" asChild>
                <Link href="/signup">
                  Start the Demo
                  <ArrowRight />
                </Link>
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-3"
            >
              {demoHighlights.map((highlight, i) => (
                <motion.li
                  key={highlight}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 rounded-xl border border-white/6 bg-white/[0.04] px-5 py-4 backdrop-blur-sm transition-colors hover:border-primary/20 hover:bg-white/[0.06]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 font-mono text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground/90">
                    {highlight}
                  </span>
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
          className="relative overflow-hidden rounded-3xl border border-white/8 px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent" />
          <div className="absolute inset-x-0 top-0 h-px glow-line" />

          <div className="relative">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Ready to meet your twin?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
              Turn your lifestyle data into a living, speaking carbon companion
              — built to win.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button variant="glow" size="xl" asChild>
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/login">Already have an account?</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
