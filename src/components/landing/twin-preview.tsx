"use client";

import { motion } from "framer-motion";
import {
  Car,
  Gauge,
  Leaf,
  MessageCircle,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { calculateCarbonResult, formatTonnes } from "@/lib/carbon/calculator";
import { useOnboardingStore } from "@/store/onboarding";
import type { OnboardingData } from "@/types";

const sampleProfile: OnboardingData = {
  name: "Ava",
  transport: "mixed",
  diet: "balanced",
  homeEnergy: "medium",
  household: "couple",
  shopping: "moderate",
  travel: "occasional",
  motivation: "shrink-footprint",
};

const sampleResult = calculateCarbonResult(sampleProfile);

function TwinOrb({ annualTonnes }: { annualTonnes: string }) {
  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <div
        className="absolute inset-0 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(0,212,255,0.25) 0%, transparent 70%)",
          animation: "pulse-ring 4s ease-in-out infinite",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="rgba(0,212,255,0.12)"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          stroke="rgba(0,212,255,0.22)"
          strokeWidth="1"
          className="twin-ring origin-center"
          style={{ transformOrigin: "100px 100px" }}
        />
        <circle
          cx="100"
          cy="100"
          r="58"
          stroke="rgba(125,249,255,0.15)"
          strokeWidth="1"
          className="twin-ring-reverse origin-center"
          style={{ transformOrigin: "100px 100px" }}
        />
      </svg>

      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full sm:h-32 sm:w-32"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #7DF9FF, #00D4FF 45%, #0c4a6e 75%, #08111B)",
          boxShadow:
            "0 0 60px rgba(0,212,255,0.35), inset 0 2px 20px rgba(125,249,255,0.2)",
        }}
      >
        <span className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {annualTonnes}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/70">
          tonnes/yr
        </span>
      </motion.div>
    </div>
  );
}

export function TwinPreview() {
  const { hasHydrated, result } = useOnboardingStore();
  const activeResult = hasHydrated && result ? result : sampleResult;
  const isPersonal = hasHydrated && Boolean(result);
  const annual = useCountUp({
    end: activeResult.annualKg / 1000,
    duration: 1800,
    decimals: 1,
    startOnView: false,
  });
  const score = useCountUp({
    end: activeResult.carbonScore,
    duration: 1500,
    startOnView: false,
  });
  const savings = useCountUp({
    end: activeResult.recommendedActions[0]?.annualSavingsKg ?? 0,
    duration: 1600,
    suffix: "kg",
    startOnView: false,
  });

  const breakdownRows = [
    {
      label: "Transport",
      pct: activeResult.breakdownPct.transport,
      color: "#00D4FF",
      icon: Car,
    },
    {
      label: "Food",
      pct: activeResult.breakdownPct.food,
      color: "#22C55E",
      icon: Utensils,
    },
    {
      label: "Home",
      pct: activeResult.breakdownPct.home,
      color: "#7DF9FF",
      icon: Zap,
    },
    {
      label: "Shopping",
      pct: activeResult.breakdownPct.shopping,
      color: "#F59E0B",
      icon: Leaf,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-b from-[#00D4FF]/15 via-[#3B82F6]/5 to-transparent opacity-90 blur-2xl" />

      <div className="glass-strong relative overflow-hidden rounded-[1.75rem] glow-cyan">
        <div className="absolute inset-x-0 top-0 h-px glow-line" />

        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/50" />
              <div className="h-2.5 w-2.5 rounded-full bg-[#00D4FF]/60" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              {isPersonal ? "your live twin" : "sample twin powered by the live engine"}
            </span>
          </div>
          <div className="rounded-full border border-border bg-primary/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-primary">
            {isPersonal ? "Personalized" : "Sample"}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-border p-6 lg:border-b-0 lg:border-r lg:p-8">
            <TwinOrb annualTonnes={formatTonnes(activeResult.annualKg)} />

            <div className="mt-6 text-center">
              <p className="font-display text-lg font-bold text-foreground">
                {activeResult.twin.name}
              </p>
              <p className="text-sm text-primary">
                {activeResult.twin.personality} · {activeResult.twin.avatarCode}
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              {breakdownRows.map((row, index) => {
                const Icon = row.icon;
                return (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="w-16 text-xs text-muted-foreground">
                      {row.label}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full glass">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.pct}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-xs text-foreground/70">
                      {row.pct}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 p-6 lg:p-8">
            <div className="grid grid-cols-3 gap-3">
              <div ref={annual.ref} className="glass rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold text-primary">
                  {annual.formatted}t
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Annual
                </p>
              </div>
              <div ref={score.ref} className="glass rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold text-success">
                  {score.formatted}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Score
                </p>
              </div>
              <div ref={savings.ref} className="glass rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold text-success">
                  {savings.formatted}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Top save
                </p>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Carbon Budget
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-primary">
                  {Math.round(
                    (activeResult.dailyKg / activeResult.dailyBudgetKg) * 100
                  )}
                  %
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full glass">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (activeResult.dailyKg / activeResult.dailyBudgetKg) * 100
                      )
                    )}%`,
                  }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-[#0369A1] via-[#00D4FF] to-[#7DF9FF]"
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </motion.div>
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>{activeResult.dailyKg} kg/day today</span>
                <span>{activeResult.dailyBudgetKg} kg target</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                Coach note
              </div>
              <p className="mt-2.5 min-h-[3.5rem] text-sm leading-relaxed text-foreground/90">
                {activeResult.coach[0].description}
              </p>
            </div>

            <div className="flex gap-2">
              {activeResult.simulations.steady.outlook.slice(0, 2).map((outlook) => (
                <div
                  key={outlook.years}
                  className="glass flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">
                    {outlook.years}y {"->"} {formatTonnes(outlook.plannedAnnualKg)}t
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
