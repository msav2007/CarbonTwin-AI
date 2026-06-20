import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Sparkles, Zap, Target, Leaf, AlertCircle } from "lucide-react";
import {
  generateCarbonCoachMessage,
  isGeminiAvailable,
  type AICarbonCoachResponse,
} from "@/lib/gemini/client";
import type { OnboardingData } from "@/types";

function AiCoachCard({ response }: { response: AICarbonCoachResponse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-cyan-500/5 to-transparent p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg font-semibold text-foreground">
          Your AI Coach Says
        </h2>
        <Badge variant="glow" className="ml-auto text-xs">Gemini AI</Badge>
      </div>
      <p className="text-sm leading-relaxed text-foreground/90 mb-4">{response.message}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-cyan-500/15 bg-black/20 p-3">
          <p className="text-xs font-mono uppercase tracking-wider text-primary mb-1">Top Tip</p>
          <p className="text-sm text-foreground/80">{response.topTip}</p>
        </div>
        <div className="rounded-xl border border-success/15 bg-black/20 p-3">
          <p className="text-xs font-mono uppercase tracking-wider text-success mb-1">Encouragement</p>
          <p className="text-sm text-foreground/80">{response.encouragement}</p>
        </div>
      </div>
    </motion.div>
  );
}

function AiCoachSkeleton() {
  return (
    <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 animate-pulse">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-5 w-5 rounded-full bg-primary/20" />
        <div className="h-4 w-40 rounded bg-primary/20" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-white/10" />
        <div className="h-3 w-4/5 rounded bg-white/10" />
        <div className="h-3 w-3/5 rounded bg-white/10" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-16 rounded-xl bg-white/5" />
        <div className="h-16 rounded-xl bg-white/5" />
      </div>
    </div>
  );
}

export default function CoachPage() {
  const { hasHydrated, data, result } = useOnboardingStore();
  const [aiResponse, setAiResponse] = useState<AICarbonCoachResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (!result || !data || !isGeminiAvailable()) return;

    let cancelled = false;
    setAiLoading(true);
    setAiError(null);

    generateCarbonCoachMessage(data as OnboardingData, result)
      .then((response) => {
        if (!cancelled) setAiResponse(response);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : "AI coaching unavailable.";
          setAiError(msg);
        }
      })
      .finally(() => {
        if (!cancelled) setAiLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [result, data]);

  if (!hasHydrated || !result) {
    return (
      <Container className="py-20 text-center">
        <p className="text-muted-foreground">Loading your coach...</p>
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
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Personalized <span className="text-gradient">Guidance</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Context-aware recommendations based on your {result.topCategory} habits.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {isGeminiAvailable() && (
            aiLoading ? (
              <AiCoachSkeleton />
            ) : aiError ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-start gap-3" role="alert">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">AI coaching unavailable right now. Static insights are shown below.</p>
              </div>
            ) : aiResponse ? (
              <AiCoachCard response={aiResponse} />
            ) : null
          )}

          {result.coach.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-border glass">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {insight.tone === "encouraging" && <Zap className="h-5 w-5 text-amber-500" />}
                      {insight.tone === "warning" && <Target className="h-5 w-5 text-red-400" />}
                      {insight.tone === "opportunity" && <Leaf className="h-5 w-5 text-success" />}
                      {insight.title}
                    </CardTitle>
                    <Badge variant="outline">{insight.tone}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed text-muted-foreground">{insight.description}</p>
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
            <h2 className="mb-4 font-display text-xl font-semibold text-foreground">Priority Action Plan</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {result.recommendedActions.map((action) => (
                <Card key={action.id} className="border-border glass">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="glow">{action.difficulty}</Badge>
                      <span className="text-xs text-primary">{action.timelineLabel}</span>
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                    <div className="rounded-lg bg-black/20 p-3 mb-4 border border-cyan-500/10">
                      <p className="text-xs font-mono text-success mb-1">Impact</p>
                      <p className="text-sm font-medium text-foreground">Save {action.annualSavingsKg} kg CO₂ / yr</p>
                    </div>
                    <p className="text-xs font-medium text-primary mb-1">First step:</p>
                    <p className="text-sm text-muted-foreground">{action.firstStep}</p>
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
