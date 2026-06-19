"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { TwinPreview } from "@/components/landing/twin-preview";

const storyBeats = [
  {
    act: "01",
    title: "You live",
    text: "Every commute, meal, and purchase emits carbon silently.",
  },
  {
    act: "02",
    title: "We mirror",
    text: "Gemini builds a living twin that reflects your real footprint.",
  },
  {
    act: "03",
    title: "You improve",
    text: "Simulate futures, scan receipts, hear your twin guide you.",
  },
];

const headlineWords = ["Meet", "your", "Carbon", "Twin"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36 sm:pb-12">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="glow" className="mb-6 px-4 py-1.5 text-xs sm:text-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                PromptWars Challenge 3 · AI Carbon Intelligence
              </Badge>

              <h1 className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mr-[0.25em] inline-block last:mr-0"
                  >
                    {word === "Carbon" ? (
                      <span className="text-gradient">{word}</span>
                    ) : word === "Twin" ? (
                      <span className="text-gradient-warm">{word}</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
              >
                Climate data is abstract. Your twin makes it{" "}
                <span className="font-medium text-foreground/90">personal</span>,{" "}
                <span className="font-medium text-foreground/90">visual</span>, and{" "}
                <span className="font-medium text-foreground/90">actionable</span>{" "}
                — powered by Gemini multimodal AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-8 space-y-3"
              >
                {storyBeats.map((beat, i) => (
                  <div
                    key={beat.act}
                    className="group flex items-start gap-4 rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 transition-colors hover:border-primary/15 hover:bg-white/[0.04]"
                  >
                    <span className="font-mono text-xs font-bold text-primary">
                      {beat.act}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground/95">
                        {beat.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {beat.text}
                      </p>
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary/60" />
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button variant="glow" size="xl" asChild>
                  <Link href="/signup">
                    Create Your Twin
                    <ArrowRight />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild>
                  <a href="#demo">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </a>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="mt-4 text-xs text-muted-foreground/80"
              >
                Full judge demo in under 3 minutes · No credit card
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:pl-4"
          >
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-emerald-500/10 blur-3xl" />
            <TwinPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
