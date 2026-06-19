"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { TwinPreview } from "@/components/landing/twin-preview";

const stats = [
  { value: "4.2t", label: "Avg. annual footprint", suffix: "CO₂e" },
  { value: "< 3min", label: "Full demo flow", suffix: "" },
  { value: "Gemini", label: "Multimodal AI", suffix: "Vision + Text" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-16 sm:pt-36 sm:pb-24">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl text-center"
        >
          <Badge variant="glow" className="mb-8 px-4 py-1.5 text-xs sm:text-sm">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            PromptWars Challenge 3 · National Hackathon
          </Badge>

          <h1 className="font-display text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Your lifestyle,{" "}
            <span className="text-gradient">visualized as a twin</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-xl sm:leading-relaxed">
            CarbonTwin AI generates a living digital twin of your carbon
            footprint — simulates your future, scans receipts, and speaks
            insights that make climate action deeply personal.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="glow" size="xl" asChild>
              <Link href="/signup">
                Create Your Twin
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#demo">
                <Play className="h-4 w-4" />
                Watch Demo Flow
              </a>
            </Button>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            Free to start · No credit card · Built for judges in under 3 minutes
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass group rounded-2xl p-5 text-center transition-all hover:border-primary/20 hover:bg-white/[0.04]"
            >
              <p className="font-display text-2xl font-bold text-primary sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm font-medium text-foreground/90">
                {stat.label}
              </p>
              {stat.suffix && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stat.suffix}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>

        <TwinPreview />
      </Container>
    </section>
  );
}
