
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Car,
  Cpu,
  Gauge,
  Home,
  LayoutDashboard,
  Leaf,
  Plane,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Target,
  TrendingDown,
  Utensils,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { useCountUp } from "@/hooks/use-count-up";
import {
  formatTonnes,
} from "@/lib/carbon/calculator";
import type { CategoryBreakdown, CategoryKey } from "@/lib/carbon/types";
import { useOnboardingStore } from "@/store/onboarding";

const CATEGORY_META: {
  key: CategoryKey;
  label: string;
  icon: typeof Car;
  color: string;
}[] = [
  { key: "transport", label: "Transport", icon: Car, color: "#00D4FF" },
  { key: "food", label: "Food", icon: Utensils, color: "#22C55E" },
  { key: "home", label: "Home Energy", icon: Home, color: "#7DF9FF" },
  { key: "travel", label: "Travel", icon: Plane, color: "#A78BFA" },
  { key: "shopping", label: "Shopping", icon: ShoppingBag, color: "#F59E0B" },
];

const DOMINANT_ICON: Record<CategoryKey, typeof Car> = {
  transport: Car,
  food: Leaf,
  home: Home,
  travel: Plane,
  shopping: ShoppingBag,
};

function ScoreRing({ score, delay = 0 }: { score: number; delay?: number }) {
  const [animated, setAnimated] = useState(0);
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const duration = 1800;
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimated(Math.round(eased * score));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay);

    return () => window.clearTimeout(timeout);
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
        <circle
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
            <stop offset="55%" stopColor="#7DF9FF" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.35, duration: 0.45 }}
          className="font-display text-5xl font-bold text-foreground"
        >
          {animated}
        </motion.span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground">
          Carbon Score
        </span>
      </div>
    </div>
  );
}

function TypewriterSummary({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      let index = 0;
      interval = window.setInterval(() => {
        setDisplayed(text.slice(0, index));
        index += 1;
        if (index > text.length) {
          window.clearInterval(interval);
        }
      }, 16);
    }, 800);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [text]);

  return (
    <p className="text-sm leading-relaxed text-foreground/90 sm:text-base">
      {displayed}
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-primary" />
    </p>
  );
}

function TwinAvatar({
  code,
  category,
}: {
  code: string;
  category: CategoryKey;
}) {
  const Icon = DOMINANT_ICON[category];

  return (
    <div className="relative mx-auto h-36 w-36">
      <motion.div
        className="absolute inset-0 rounded-full border border-cyan-300/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-3 rounded-full border border-dashed border-cyan-300/20"
        animate={{ rotate: -360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.6, type: "spring" }}
        className="absolute inset-7 flex flex-col items-center justify-center rounded-3xl border border-cyan-300/25 bg-gradient-to-br from-cyan-500/25 via-blue-500/10 to-emerald-400/10 shadow-sm"
      >
        <Icon className="h-9 w-9 text-primary" />
        <span className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-primary">
          {code}
        </span>
      </motion.div>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone = "primary",
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  tone?: "primary" | "success" | "warning";
}) {
  const toneClass = {
    primary: "text-primary",
    success: "text-success",
    warning: "text-amber-500",
  }[tone];

  return (
    <div className="rounded-2xl glass p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className={`mt-3 font-display text-2xl font-bold ${toneClass}`}>
        {value}
      </p>
    </div>
  );
}

function getCategoryMeta(category: CategoryKey) {
  return CATEGORY_META.find((item) => item.key === category) ?? CATEGORY_META[0];
}

export function TwinReveal() {
  const [, navigate] = useLocation();
  const { result } = useOnboardingStore();
  const isReady = Boolean(result && Array.isArray(result.recommendedActions));

  const annual = useCountUp({
    end: result ? result.annualKg / 1000 : 0,
    decimals: 1,
    duration: 1800,
    startOnView: false,
  });
  const target = useCountUp({
    end: result ? result.targetAnnualKg / 1000 : 0,
    decimals: 1,
    duration: 1800,
    startOnView: false,
  });

  useEffect(() => {
    if (!isReady) {
      navigate("/onboarding");
    }
  }, [isReady, navigate]);

  if (!result || !isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-8 w-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  const {
    twin,
    carbonScore,
    targetScore,
    breakdown,
    breakdownPct,
    vsAveragePct,
    dailyKg,
    dailyBudgetKg,
    reductionPotentialKg,
    recommendedActions,
    targetAnnualKg,
  } = result;
  const topMeta = getCategoryMeta(result.topCategory);
  const budgetPct = Math.min(140, Math.round((dailyKg / dailyBudgetKg) * 100));
  const reductionPct = Math.round((reductionPotentialKg / result.annualKg) * 100);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.25]" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
          className="absolute left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#00D4FF]/10 blur-[150px]"
        />
      </div>

      <header className="border-b border-border bg-background/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-primary/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-foreground">
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

      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"
          >
            <section className="glass-strong rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
                Carbon Twin Reveal
              </p>

              <div className="mt-8 grid gap-8 md:grid-cols-[10rem_1fr] md:items-center">
                <TwinAvatar
                  code={twin.avatarCode}
                  category={twin.dominantCategory}
                />

                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-display text-4xl font-bold text-foreground sm:text-5xl"
                  >
                    Meet <span className="text-gradient">{twin.name}</span>
                  </motion.h1>
                  <p className="mt-2 text-sm text-primary">
                    Built for {twin.ownerName} - {twin.archetype}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant="glow">{twin.personality}</Badge>
                    {twin.traits.map((trait) => (
                      <Badge key={trait} variant="outline" className="text-muted-foreground">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-white/[0.025] p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h2 className="font-display text-lg font-semibold text-foreground">
                    Twin Speaks
                  </h2>
                </div>
                <TypewriterSummary text={twin.summary} />
              </div>
            </section>

            <section className="glass-strong rounded-2xl p-6 sm:p-8">
              <ScoreRing score={carbonScore} delay={350} />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div ref={annual.ref}>
                  <MetricCard
                    icon={Gauge}
                    label="Annual CO2"
                    value={`${annual.formatted}t`}
                  />
                </div>
                <div ref={target.ref}>
                  <MetricCard
                    icon={TrendingDown}
                    label="Action target"
                    value={`${target.formatted}t`}
                    tone="success"
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl glass p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                      Daily budget
                    </p>
                    <p className="mt-1 font-display text-2xl font-bold text-foreground">
                      {dailyKg} kg / {dailyBudgetKg} kg
                    </p>
                  </div>
                  <Badge variant={dailyKg <= dailyBudgetKg ? "success" : "glow"}>
                    {budgetPct}%
                  </Badge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full glass">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#22C55E] via-[#7DF9FF] to-[#F59E0B]"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(budgetPct, 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Compared to the 4.2t global average baseline.
                </p>
              </div>
            </section>
          </motion.div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="glass-strong rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    Emissions fingerprint
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatTonnes(result.annualKg)}t total - strongest signal:
                    {" "}
                    {topMeta.label.toLowerCase()}
                  </p>
                </div>
                <Badge variant="glow" className="shrink-0">
                  {vsAveragePct > 0 ? "+" : ""}
                  {vsAveragePct}% avg
                </Badge>
              </div>

              <div className="mt-7 space-y-4">
                {CATEGORY_META.map((cat, i) => {
                  const Icon = cat.icon;
                  const kg = breakdown[cat.key as keyof CategoryBreakdown];
                  const pct = breakdownPct[cat.key as keyof CategoryBreakdown];

                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.55 + i * 0.08 }}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                        <div className="flex min-w-0 items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate text-foreground">
                            {cat.label}
                          </span>
                        </div>
                        <span className="shrink-0 font-mono text-muted-foreground">
                          {kg.toLocaleString()} kg / {pct}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full glass">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{
                            duration: 1,
                            delay: 0.7 + i * 0.1,
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
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="glass-strong rounded-2xl p-6 sm:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-semibold text-foreground">
                    First action plan
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Potential reduction: {reductionPotentialKg.toLocaleString()} kg
                    CO2/year ({reductionPct}%)
                  </p>
                </div>
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10">
                  <Target className="h-5 w-5 text-success" />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {recommendedActions.map((action, index) => {
                  const meta = getCategoryMeta(action.category);

                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 + index * 0.08 }}
                      className="rounded-2xl glass p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-muted-foreground">
                              {meta.label}
                            </Badge>
                            <Badge variant="glow">
                              {action.annualSavingsKg} kg saved
                            </Badge>
                          </div>
                          <h3 className="font-medium text-foreground">
                            {action.title}
                          </h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-border px-2.5 py-1 text-xs text-primary">
                          {action.difficulty}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          </div>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6 rounded-2xl border border-border bg-gradient-to-r from-cyan-500/[0.12] via-white/[0.03] to-emerald-400/[0.08] p-6 sm:p-8"
          >
            <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Simulation seed
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-foreground">
                  If you apply this plan, {twin.name} projects a score of{" "}
                  <span className="text-gradient">{targetScore}/100</span>.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  That would move your annual footprint toward{" "}
                  {formatTonnes(targetAnnualKg)}t CO2 while preserving the
                  lifestyle pattern you entered.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
                <Button variant="glow" size="lg" asChild>
                  <Link href="/dashboard">
                    <LayoutDashboard />
                    Enter Dashboard
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    useOnboardingStore.getState().reset();
                    navigate("/onboarding");
                  }}
                >
                  <RotateCcw />
                  Retake
                </Button>
              </div>
            </div>
          </motion.section>
        </div>
      </Container>
    </div>
  );
}
