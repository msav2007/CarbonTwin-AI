"use client";

import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle2 } from "lucide-react";

export default function ProgressPage() {
  const { hasHydrated, result } = useOnboardingStore();

  if (!hasHydrated || !result) {
    return (
      <Container className="py-20 text-center">
        <p className="text-muted-foreground">Loading tracker...</p>
      </Container>
    );
  }

  const budgetPct = Math.round((result.dailyKg / result.dailyBudgetKg) * 100);

  return (
    <Container className="py-10 sm:py-14">
      <main className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Badge variant="glow" className="mb-4">
            <Activity className="mr-2 h-3.5 w-3.5" />
            Progress Tracking
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Daily <span className="text-gradient">Carbon Budget</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Monitor your daily footprint against your personal reduction targets.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="border-border glass">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Daily Target</p>
              <p className="mt-2 font-display text-3xl font-bold text-foreground">{result.dailyBudgetKg} <span className="text-lg text-muted-foreground font-normal">kg</span></p>
            </CardContent>
          </Card>
          <Card className="border-border glass">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Current Daily Avg</p>
              <p className={`mt-2 font-display text-3xl font-bold ${budgetPct > 100 ? 'text-red-400' : 'text-success'}`}>{result.dailyKg} <span className="text-lg text-muted-foreground font-normal">kg</span></p>
            </CardContent>
          </Card>
          <Card className="border-border glass">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground">Current Score</p>
              <p className="mt-2 font-display text-3xl font-bold text-primary">{result.carbonScore}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border glass">
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">Daily Allowance Used</span>
              <span className="font-bold text-foreground">{budgetPct}%</span>
            </div>
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(budgetPct, 100)}%` }}
                transition={{ duration: 1 }}
                className={`h-full ${budgetPct > 100 ? 'bg-red-500' : 'bg-primary'}`}
              />
            </div>
            {budgetPct > 100 && (
              <p className="mt-4 text-sm text-red-400">
                You are currently {budgetPct - 100}% over your recommended daily carbon budget. Check the AI Coach for quick wins to reduce your daily average.
              </p>
            )}
            {budgetPct <= 100 && (
              <div className="mt-4 flex items-center gap-2 text-sm text-success">
                <CheckCircle2 className="h-4 w-4" />
                You are staying within your daily carbon budget. Great job!
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </Container>
  );
}
