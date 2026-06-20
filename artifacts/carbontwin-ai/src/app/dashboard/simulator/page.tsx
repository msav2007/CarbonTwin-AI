"use client";

import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { formatTonnes } from "@/lib/carbon/calculator";

export default function SimulatorPage() {
  const { hasHydrated, result } = useOnboardingStore();

  if (!hasHydrated || !result) {
    return (
      <Container className="py-20 text-center">
        <p className="text-muted-foreground">Loading simulator...</p>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <main className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Badge variant="glow" className="mb-4">
            <Clock className="mr-2 h-3.5 w-3.5" />
            Future Simulator
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Forecast Your <span className="text-gradient">Impact</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            See how your footprint changes if you follow a steady plan or push harder.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Steady Simulation */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="h-full border-border bg-gradient-to-b from-cyan-500/[0.02] to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <CardTitle>Steady Path</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{result.simulations.steady.summary}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.simulations.steady.outlook.map((outlook) => (
                    <div key={outlook.years} className="rounded-xl border border-white/5 bg-black/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-bold text-foreground">Year {outlook.years}</span>
                        <Badge variant="outline" className="text-xs">Score: {outlook.scoreIfMaintained}</Badge>
                      </div>
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground">Baseline</p>
                          <p className="text-lg font-medium text-red-400/80">{formatTonnes(outlook.baselineAnnualKg)}t</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase text-muted-foreground">Projected</p>
                          <p className="text-2xl font-bold text-success">{formatTonnes(outlook.plannedAnnualKg)}t</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{outlook.narrative}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Ambitious Simulation */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Card className="h-full border-amber-500/[0.1] bg-gradient-to-b from-amber-500/[0.02] to-transparent">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-amber-500">Ambitious Path</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{result.simulations.ambitious.summary}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.simulations.ambitious.outlook.map((outlook) => (
                    <div key={outlook.years} className="rounded-xl border border-white/5 bg-black/20 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-bold text-foreground">Year {outlook.years}</span>
                        <Badge variant="outline" className="text-xs text-amber-500">Score: {outlook.scoreIfMaintained}</Badge>
                      </div>
                      <div className="flex justify-between items-end mb-3">
                        <div>
                          <p className="text-[10px] uppercase text-muted-foreground">Baseline</p>
                          <p className="text-lg font-medium text-red-400/80">{formatTonnes(outlook.baselineAnnualKg)}t</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] uppercase text-muted-foreground">Projected</p>
                          <p className="text-2xl font-bold text-amber-500">{formatTonnes(outlook.plannedAnnualKg)}t</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{outlook.narrative}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </Container>
  );
}
