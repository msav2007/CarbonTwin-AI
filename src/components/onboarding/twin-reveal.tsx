"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Car,
  Cpu,
  Home,
  Plane,
  ShoppingBag,
  Utensils,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { useCountUp } from "@/hooks/use-count-up";
import { formatTonnes } from "@/lib/carbon/calculator";
import { useOnboardingStore } from "@/store/onboarding";
import type { CategoryBreakdown } from "@/lib/carbon/calculator";

const CATEGORY_META: {
  key: keyof CategoryBreakdown;
  label: string;
  icon: typeof Car;
  color: string;
}[] = [
  { key: "transport", label: "Transport", icon: Car, color: "#00D4FF" },
  { key: "food", label: "Food", icon: Utensils, color: "#38BDF8" },
  { key: "home", label: "Home Energy", icon: Home, color: "#7DF9FF" },
  { key: "travel", label: "Travel", icon: Plane, color: "#6366F1" },
  { key: "shopping", label: "Shopping", icon: ShoppingBag, color: "#818CF8" },
];

function ScoreRing({ score, delay = 0 }: { score: number; delay?: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timeout = setTimeout(() => {
      let start = 0;
      const duration = 2000;
      const startTime = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        start = Math.round(eased * score);
        setAnimated(start);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay);
    return () => clearTimeout(timeout);
  }, [score, delay]);

  return (
    <div className="relative mx-auto h-52 w-52">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(0,212,255,0.08)"
          strokeWidth="10"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#7DF9FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-display text-5xl font-bold text-[#F8FAFC]"
        >
          {animated}
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-[#94A3B8]">
          Carbon Score
        </span>
      </div>
    </div>
  );
}

function TypewriterSummary({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 18);
      return () => clearInterval(interval);
    }, 1200);
    return () => clearTimeout(delay);
  }, [text]);

  return (
    <p className="text-sm leading-relaxed text-[#F8FAFC]/90 sm:text-base">
      {displayed}
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
    </p>
  );
}

export function TwinReveal() {
  const router = useRouter();
  const { result } = useOnboardingStore();
  const annual = useCountUp({
    end: result ? result.annualKg / 1000 : 0,
    decimals: 1,
    duration: 2000,
    startOnView: false,
  });
  const monthly = useCountUp({
    end: result?.monthlyKg ?? 0,
    duration: 1800,
    startOnView: false,
  });

  useEffect(() => {
    if (!result) {
      router.replace("/onboarding");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#08111B]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  const { twin, carbonScore, breakdown, breakdownPct, vsAveragePct } = result;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08111B]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-radial-glow" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00D4FF]/10 blur-[150px]"
        />
      </div>

      <header className="border-b border-cyan-500/[0.06] bg-[#08111B]/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-[#F8FAFC]">
              Carbon<span className="text-primary">Twin</span>
            </span>
          </Link>
          <Badge variant="glow" className="gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Twin Generated
          </Badge>
        </Container>
      </header>

      <Container className="py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-mono text-xs uppercase tracking-[0.25em] text-primary"
          >
            Carbon Twin Reveal
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, type: "spring" }}
            className="mx-auto mt-6 flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-500/20 to-blue-600/10 text-4xl shadow-cyan"
          >
            {twin.avatarEmoji}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 font-display text-4xl font-bold text-[#F8FAFC] sm:text-5xl"
          >
            Meet{" "}
            <span className="text-gradient">{twin.name}</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="mt-3 flex flex-wrap items-center justify-center gap-2"
          >
            <Badge variant="glow">{twin.personality}</Badge>
            {twin.traits.map((trait) => (
              <Badge key={trait} variant="outline" className="text-[#94A3B8]">
                {trait}
              </Badge>
            ))}
          </motion.div>

          <p className="mt-2 text-sm text-[#7DF9FF]">{twin.archetype}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mx-auto mt-12 grid max-w-4xl gap-6 lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="glass-strong rounded-2xl p-6 glow-cyan sm:p-8">
            <ScoreRing score={carbonScore} delay={600} />
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] p-4 text-center">
                <p ref={annual.ref} className="font-display text-2xl font-bold text-primary">
                  {annual.formatted}t
                </p>
                <p className="mt-1 text-xs text-[#94A3B8]">Annual CO₂</p>
              </div>
              <div className="rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] p-4 text-center">
                <p ref={monthly.ref} className="font-display text-2xl font-bold text-[#7DF9FF]">
                  {monthly.formatted} kg
                </p>
                <p className="mt-1 text-xs text-[#94A3B8]">Monthly CO₂</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] p-4 text-center">
              <p
                className={`font-display text-lg font-bold ${
                  vsAveragePct <= 0 ? "text-success" : "text-amber-400"
                }`}
              >
                {vsAveragePct > 0 ? "+" : ""}
                {vsAveragePct}% vs. average
              </p>
              <p className="mt-1 text-xs text-[#94A3B8]">
                Compared to 4.2t global average
              </p>
            </div>
          </div>

          <div className="glass-strong rounded-2xl p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-[#F8FAFC]">
              Emissions Breakdown
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              {formatTonnes(result.annualKg)}t total · by category
            </p>
            <div className="mt-6 space-y-4">
              {CATEGORY_META.map((cat, i) => {
                const Icon = cat.icon;
                const kg = breakdown[cat.key];
                const pct = breakdownPct[cat.key];
                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-[#94A3B8]" />
                        <span className="text-[#F8FAFC]">{cat.label}</span>
                      </div>
                      <span className="font-mono text-[#94A3B8]">
                        {kg.toLocaleString()} kg · {pct}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 1,
                          delay: 1 + i * 0.1,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mx-auto mt-8 max-w-4xl"
        >
          <div className="glass-strong rounded-2xl border border-cyan-400/15 p-6 sm:p-8">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h2 className="font-display text-lg font-semibold text-[#F8FAFC]">
                Twin Speaks
              </h2>
            </div>
            <TypewriterSummary text={twin.summary} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
          className="mx-auto mt-10 flex max-w-md flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Button variant="glow" size="xl" asChild className="w-full sm:w-auto">
            <Link href="/dashboard">
              Enter Dashboard
              <ArrowRight />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              useOnboardingStore.getState().reset();
              router.push("/onboarding");
            }}
          >
            Retake Onboarding
          </Button>
        </motion.div>
      </Container>
    </div>
  );
}
