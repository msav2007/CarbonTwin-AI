"use client";

import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Zap, Target, Leaf } from "lucide-react";

export default function CoachPage() {
  const { hasHydrated, result } = useOnboardingStore();

  if (!hasHydrated || !result) {
    return (
      <Container className="py-20 text-center">
        <p className="text-[#94A3B8]">Loading your coach...</p>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <main className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Badge variant="glow" className="mb-4">
            <MessageCircle className="mr-2 h-3.5 w-3.5" />
            AI Coach
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
            Personalized <span className="text-gradient">Guidance</span>
          </h1>
          <p className="mt-4 text-base text-[#94A3B8]">
            Context-aware recommendations based on your {result.topCategory} habits.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {result.coach.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-cyan-500/[0.08] bg-white/[0.02]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {insight.tone === "encouraging" && <Zap className="h-5 w-5 text-amber-400" />}
                      {insight.tone === "warning" && <Target className="h-5 w-5 text-red-400" />}
                      {insight.tone === "opportunity" && <Leaf className="h-5 w-5 text-success" />}
                      {insight.title}
                    </CardTitle>
                    <Badge variant="outline">{insight.tone}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-[#94A3B8]">{insight.description}</p>
                  <p className="mt-4 font-medium text-primary">{insight.cta}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="mb-4 font-display text-xl font-semibold text-[#F8FAFC]">Priority Action Plan</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.recommendedActions.map((action) => (
                <Card key={action.id} className="border-cyan-500/[0.08] bg-white/[0.02]">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="glow">{action.difficulty}</Badge>
                      <span className="text-xs text-primary">{action.timelineLabel}</span>
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#94A3B8] mb-4">{action.description}</p>
                    <div className="rounded-lg bg-black/20 p-3 mb-4 border border-cyan-500/10">
                      <p className="text-xs font-mono text-success mb-1">Impact</p>
                      <p className="text-sm font-medium text-[#F8FAFC]">Save {action.annualSavingsKg} kg CO₂ / yr</p>
                    </div>
                    <p className="text-xs font-medium text-primary mb-1">First step:</p>
                    <p className="text-sm text-[#94A3B8]">{action.firstStep}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </Container>
  );
}
