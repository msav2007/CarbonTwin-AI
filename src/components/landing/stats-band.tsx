"use client";

import { motion } from "framer-motion";
import { Globe2, TrendingDown, Users, Zap } from "lucide-react";
import { Container } from "@/components/shared/container";
import { useCountUp } from "@/hooks/use-count-up";

const stats = [
  {
    icon: Globe2,
    end: 36,
    decimals: 0,
    suffix: "B",
    unit: "tonnes CO₂",
    label: "Global emissions per year",
    context: "The scale of the crisis",
    color: "text-red-400/90",
    barPct: 100,
  },
  {
    icon: Users,
    end: 4.2,
    decimals: 1,
    suffix: "t",
    unit: "per person",
    label: "Average personal footprint",
    context: "What most people emit annually",
    color: "text-amber-400/90",
    barPct: 72,
  },
  {
    icon: TrendingDown,
    end: 73,
    decimals: 0,
    suffix: "%",
    unit: "",
    label: "Want to reduce emissions",
    context: "But lack personalized guidance",
    color: "text-emerald-400/90",
    barPct: 73,
  },
  {
    icon: Zap,
    end: 847,
    decimals: 0,
    suffix: "kg",
    unit: "potential savings",
    label: "Avg. twin-identified savings",
    context: "Per user, first 90 days",
    color: "text-teal-300",
    barPct: 58,
  },
];

function StatCard({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const Icon = stat.icon;
  const { ref, formatted } = useCountUp({
    end: stat.end,
    decimals: stat.decimals,
    suffix: stat.suffix,
    duration: 2200 + index * 200,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-primary/20 hover:bg-white/[0.04]"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]">
          <Icon className={`h-5 w-5 ${stat.color}`} />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
          {stat.context}
        </span>
      </div>

      <div className="mt-5">
        <p className={`font-display text-4xl font-bold tracking-tight sm:text-5xl ${stat.color}`}>
          {formatted}
        </p>
        {stat.unit && (
          <p className="mt-1 text-xs font-medium text-muted-foreground">
            {stat.unit}
          </p>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-foreground/90">{stat.label}</p>

      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.05]">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${stat.barPct}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 + index * 0.1 }}
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
        />
      </div>
    </motion.div>
  );
}

export function StatsBand() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px glow-line opacity-50" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            The Problem · The Opportunity
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight sm:text-3xl">
            Carbon is invisible.{" "}
            <span className="text-gradient">We make it undeniable.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
