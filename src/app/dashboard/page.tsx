"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Cpu,
  Gauge,
  Leaf,
  Sparkles,
  Target,
  TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { formatTonnes } from "@/lib/carbon/calculator";
import { useOnboardingStore } from "@/store/onboarding";

export default function DashboardPage() {
  const router = useRouter();
  const { result } = useOnboardingStore();
  const isReady = Boolean(result && Array.isArray(result.recommendedActions));

  useEffect(() => {
    if (!isReady) {
      router.replace("/onboarding");
    }
  }, [isReady, router]);

  if (!result || !isReady) {
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

  const budgetPct = Math.min(
    140,
    Math.round((result.dailyKg / result.dailyBudgetKg) * 100)
  );
  const topAction = result.recommendedActions[0];

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#08111B]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.25]" />
        <div className="absolute inset-0 bg-radial-glow" />
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
          <Badge variant="glow">Demo Dashboard</Badge>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <main className="mx-auto max-w-6xl">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-6 lg:grid-cols-[1fr_22rem]"
          >
            <div className="glass-strong rounded-2xl p-6 sm:p-8">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
                Carbon command center
              </p>
              <h1 className="mt-3 font-display text-4xl font-bold text-[#F8FAFC] sm:text-5xl">
                {result.twin.name} is tracking your footprint.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
                This dashboard turns the reveal into an ongoing awareness loop:
                score, daily budget, top action, and future simulation seed.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-cyan-500/[0.08] bg-white/[0.02] p-4">
                  <Gauge className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-3xl font-bold text-[#F8FAFC]">
                    {result.carbonScore}
                  </p>
                  <p className="text-xs text-[#94A3B8]">Carbon Score</p>
                </div>
                <div className="rounded-2xl border border-cyan-500/[0.08] bg-white/[0.02] p-4">
                  <Leaf className="h-5 w-5 text-success" />
                  <p className="mt-3 font-display text-3xl font-bold text-[#F8FAFC]">
                    {formatTonnes(result.annualKg)}t
                  </p>
                  <p className="text-xs text-[#94A3B8]">Annual CO2</p>
                </div>
                <div className="rounded-2xl border border-cyan-500/[0.08] bg-white/[0.02] p-4">
                  <TrendingDown className="h-5 w-5 text-amber-300" />
                  <p className="mt-3 font-display text-3xl font-bold text-[#F8FAFC]">
                    {formatTonnes(result.targetAnnualKg)}t
                  </p>
                  <p className="text-xs text-[#94A3B8]">Action target</p>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">
                    Daily carbon budget
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-[#F8FAFC]">
                    {result.dailyKg} kg
                  </p>
                </div>
                <Badge variant={result.dailyKg <= result.dailyBudgetKg ? "success" : "glow"}>
                  {budgetPct}%
                </Badge>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetPct, 100)}%` }}
                  transition={{ duration: 0.9 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#22C55E] via-[#7DF9FF] to-[#F59E0B]"
                />
              </div>
              <p className="mt-3 text-sm text-[#94A3B8]">
                Benchmark: {result.dailyBudgetKg} kg/day for a 4.2t annual path.
              </p>

              <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-500/[0.05] p-4">
                <div className="flex items-center gap-2 text-[#7DF9FF]">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Next best action</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold text-[#F8FAFC]">
                  {topAction.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                  {topAction.description}
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
          >
            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-[#F8FAFC]">
                  Simulation preview
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                Applying the first action plan can move your score from{" "}
                {result.carbonScore} to {result.targetScore}. The next feature
                can expand this into 1, 5, and 10 year projections.
              </p>
              <Button variant="outline" className="mt-5" asChild>
                <Link href="/onboarding/reveal">
                  Reopen Reveal
                  <ArrowRight />
                </Link>
              </Button>
            </div>

            <div className="glass-strong rounded-2xl p-6">
              <h2 className="font-display text-xl font-semibold text-[#F8FAFC]">
                Action queue
              </h2>
              <div className="mt-5 space-y-3">
                {result.recommendedActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-cyan-500/[0.08] bg-white/[0.02] p-4"
                  >
                    <div>
                      <p className="font-medium text-[#F8FAFC]">
                        {action.title}
                      </p>
                      <p className="mt-1 text-sm text-[#94A3B8]">
                        {action.annualSavingsKg} kg CO2/year - {action.difficulty}
                      </p>
                    </div>
                    <Badge variant="glow">{action.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </main>
      </Container>
    </div>
  );
}
