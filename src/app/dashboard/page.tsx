"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
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

  const budgetPct = Math.min(
    140,
    Math.round((result.dailyKg / result.dailyBudgetKg) * 100)
  );
  const topAction = result.recommendedActions[0];

  return (
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
              <h1 className="mt-3 font-display text-4xl font-bold text-foreground sm:text-5xl">
                {result.twin.name} is tracking your footprint.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                This dashboard turns the reveal into an ongoing awareness loop:
                score, daily budget, top action, and future simulation seed.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-slate-50 p-4">
                  <Gauge className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-3xl font-bold text-foreground">
                    {result.carbonScore}
                  </p>
                  <p className="text-xs text-muted-foreground">Carbon Score</p>
                </div>
                <div className="rounded-2xl border border-border bg-slate-50 p-4">
                  <Leaf className="h-5 w-5 text-green-600" />
                  <p className="mt-3 font-display text-3xl font-bold text-foreground">
                    {formatTonnes(result.annualKg)}t
                  </p>
                  <p className="text-xs text-muted-foreground">Annual CO2</p>
                </div>
                <div className="rounded-2xl border border-border bg-slate-50 p-4">
                  <TrendingDown className="h-5 w-5 text-amber-500" />
                  <p className="mt-3 font-display text-3xl font-bold text-foreground">
                    {formatTonnes(result.targetAnnualKg)}t
                  </p>
                  <p className="text-xs text-muted-foreground">Action target</p>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Daily carbon budget
                  </p>
                  <p className="mt-2 font-display text-3xl font-bold text-foreground">
                    {result.dailyKg} kg
                  </p>
                </div>
                <Badge variant={result.dailyKg <= result.dailyBudgetKg ? "success" : "glow"}>
                  {budgetPct}%
                </Badge>
              </div>
              <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(budgetPct, 100)}%` }}
                  transition={{ duration: 0.9 }}
                  className="h-full rounded-full bg-primary"
                />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                Benchmark: {result.dailyBudgetKg} kg/day for a 4.2t annual path.
              </p>

              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-center gap-2 text-primary">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Next best action</span>
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold text-foreground">
                  {topAction.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
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
                <h2 className="font-display text-xl font-semibold text-foreground">
                  Simulation preview
                </h2>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
              <h2 className="font-display text-xl font-semibold text-foreground">
                Action queue
              </h2>
              <div className="mt-5 space-y-3">
                {result.recommendedActions.map((action) => (
                  <div
                    key={action.id}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-slate-50 p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {action.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {action.annualSavingsKg} kg CO2/year - {action.difficulty}
                      </p>
                    </div>
                    <Badge variant="secondary">{action.category}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        </main>
      </Container>
  );
}
