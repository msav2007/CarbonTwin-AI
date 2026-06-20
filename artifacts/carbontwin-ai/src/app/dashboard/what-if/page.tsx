import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useOnboardingStore } from "@/store/onboarding";
import { calculateCarbonResult, formatTonnes } from "@/lib/carbon/calculator";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shuffle, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { TRANSPORT_OPTIONS, FOOD_OPTIONS, ENERGY_OPTIONS, TRAVEL_OPTIONS, SHOPPING_OPTIONS } from "@/lib/onboarding/options";
import { generateWhatIfScenario, isGeminiAvailable } from "@/lib/gemini/client";
import type { OnboardingData } from "@/types";

export default function WhatIfPage() {
  const { hasHydrated, data: originalData, result: originalResult } = useOnboardingStore();
  const [testData, setTestData] = useState<OnboardingData | null>(originalData as OnboardingData);
  const [aiNarrative, setAiNarrative] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!originalData || !originalResult || !testData || !isGeminiAvailable()) return;

    const hypothetical: Partial<OnboardingData> = {};
    (Object.keys(testData) as (keyof OnboardingData)[]).forEach((key) => {
      if (testData[key] !== (originalData as OnboardingData)[key]) {
        (hypothetical as Record<string, unknown>)[key] = testData[key];
      }
    });

    if (Object.keys(hypothetical).length === 0) {
      setAiNarrative(null);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setAiLoading(true);
      setAiError(null);
      generateWhatIfScenario(originalData as OnboardingData, hypothetical, originalResult.annualKg)
        .then((narrative) => { setAiNarrative(narrative); })
        .catch((err: unknown) => {
          setAiError(err instanceof Error ? err.message : "AI analysis unavailable.");
        })
        .finally(() => { setAiLoading(false); });
    }, 800);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [testData, originalData, originalResult]);

  if (!hasHydrated || !originalData || !originalResult || !testData) {
    return (
      <Container className="py-20 text-center">
        <p className="text-muted-foreground">Loading Time Machine...</p>
      </Container>
    );
  }

  const testResult = calculateCarbonResult(testData);
  const diffKg = originalResult.annualKg - testResult.annualKg;
  const isBetter = diffKg > 0;

  const updateField = (field: keyof OnboardingData, value: string) => {
    setTestData({ ...testData, [field]: value });
  };

  return (
    <Container className="py-10 sm:py-14">
      <main className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <Badge variant="glow" className="mb-4">
            <Shuffle className="mr-2 h-3.5 w-3.5" />
            What-If Engine
          </Badge>
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Test New <span className="text-gradient">Habits</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            Change your lifestyle signals to instantly see the impact on your carbon twin.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-6">
            <Card className="border-border glass">
              <CardHeader>
                <CardTitle>Adjust Your Signals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label htmlFor="transport-select" className="text-sm font-medium text-foreground mb-2 block">Transport</label>
                  <select
                    id="transport-select"
                    className="w-full bg-background border border-cyan-500/20 rounded-lg p-2 text-sm text-muted-foreground"
                    value={testData.transport}
                    onChange={(e) => updateField("transport", e.target.value)}
                  >
                    {TRANSPORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="diet-select" className="text-sm font-medium text-foreground mb-2 block">Diet</label>
                  <select
                    id="diet-select"
                    className="w-full bg-background border border-cyan-500/20 rounded-lg p-2 text-sm text-muted-foreground"
                    value={testData.diet}
                    onChange={(e) => updateField("diet", e.target.value)}
                  >
                    {FOOD_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="energy-select" className="text-sm font-medium text-foreground mb-2 block">Home Energy</label>
                  <select
                    id="energy-select"
                    className="w-full bg-background border border-cyan-500/20 rounded-lg p-2 text-sm text-muted-foreground"
                    value={testData.homeEnergy}
                    onChange={(e) => updateField("homeEnergy", e.target.value)}
                  >
                    {ENERGY_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="travel-select" className="text-sm font-medium text-foreground mb-2 block">Travel Flights</label>
                  <select
                    id="travel-select"
                    className="w-full bg-background border border-cyan-500/20 rounded-lg p-2 text-sm text-muted-foreground"
                    value={testData.travel}
                    onChange={(e) => updateField("travel", e.target.value)}
                  >
                    {TRAVEL_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="shopping-select" className="text-sm font-medium text-foreground mb-2 block">Shopping Habits</label>
                  <select
                    id="shopping-select"
                    className="w-full bg-background border border-cyan-500/20 rounded-lg p-2 text-sm text-muted-foreground"
                    value={testData.shopping}
                    onChange={(e) => updateField("shopping", e.target.value)}
                  >
                    {SHOPPING_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Card className="border-border glass">
                <CardHeader>
                  <CardTitle>Impact Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center flex-1">
                      <p className="text-xs uppercase text-muted-foreground">Current</p>
                      <p className="font-display text-2xl font-bold text-foreground">{formatTonnes(originalResult.annualKg)}t</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground/50" />
                    <div className="text-center flex-1">
                      <p className="text-xs uppercase text-muted-foreground">Scenario</p>
                      <p className="font-display text-2xl font-bold text-primary">{formatTonnes(testResult.annualKg)}t</p>
                    </div>
                  </div>

                  <div className={`rounded-xl p-4 text-center ${isBetter ? "bg-success/10 border border-success/20" : diffKg === 0 ? "bg-white/5 border border-white/10" : "bg-red-500/10 border border-red-500/20"}`}>
                    <p className="text-sm text-muted-foreground mb-1">Difference</p>
                    <p className={`font-display text-3xl font-bold ${isBetter ? "text-success" : diffKg === 0 ? "text-foreground" : "text-red-400"}`}>
                      {isBetter ? "-" : diffKg === 0 ? "" : "+"}{Math.abs(diffKg)} kg/yr
                    </p>
                  </div>

                  <div className="mt-6">
                    <p className="text-sm font-medium text-foreground mb-2">New Score Prediction</p>
                    <div className="flex justify-between items-center bg-black/20 rounded-lg p-3 border border-white/5">
                      <span className="text-muted-foreground">Carbon Score</span>
                      <span className="font-bold text-primary">{testResult.carbonScore}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isGeminiAvailable() && (
                <Card className="border-primary/15 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {aiLoading ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-3 w-full rounded bg-white/10" />
                        <div className="h-3 w-4/5 rounded bg-white/10" />
                        <div className="h-3 w-3/5 rounded bg-white/10" />
                      </div>
                    ) : aiError ? (
                      <div className="flex items-start gap-2" role="alert">
                        <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">AI analysis unavailable.</p>
                      </div>
                    ) : aiNarrative ? (
                      <p className="text-sm leading-relaxed text-foreground/85">{aiNarrative}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Change a signal above and Gemini will analyze the real-world impact.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}
