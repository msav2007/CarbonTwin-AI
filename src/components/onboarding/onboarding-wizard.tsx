"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import {
  ENERGY_OPTIONS,
  FOOD_OPTIONS,
  getOptionLabel,
  SHOPPING_OPTIONS,
  STEP_META,
  TRANSPORT_OPTIONS,
  TRAVEL_OPTIONS,
} from "@/lib/onboarding/options";
import {
  calculateCarbonResult,
  isOnboardingComplete,
} from "@/lib/carbon/calculator";
import { useOnboardingStore } from "@/store/onboarding";
import type { OnboardingData } from "@/types";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export function OnboardingWizard() {
  const router = useRouter();
  const { step, data, setStep, updateData, setResult } = useOnboardingStore();
  const [direction, setDirection] = useState(1);
  const [generating, setGenerating] = useState(false);

  const meta = STEP_META[step - 1];

  const goNext = () => {
    setDirection(1);
    setStep(step + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(step - 1);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!data.transport;
      case 2:
        return !!data.diet;
      case 3:
        return !!data.homeEnergy;
      case 4:
        return !!data.travel && !!data.shopping;
      case 5:
        return isOnboardingComplete(data);
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (!isOnboardingComplete(data)) return;
    setGenerating(true);
    setDirection(1);

    await new Promise((r) => setTimeout(r, 1800));

    const result = calculateCarbonResult(data);
    setResult(result);
    router.push("/onboarding/reveal");
  };

  return (
    <OnboardingShell step={step}>
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              {meta.title}
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
              {meta.subtitle}
            </h1>
          </div>

          {step === 1 && (
            <div className="space-y-3">
              {TRANSPORT_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  {...opt}
                  selected={data.transport === opt.value}
                  onClick={() => updateData({ transport: opt.value })}
                />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {FOOD_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  {...opt}
                  selected={data.diet === opt.value}
                  onClick={() => updateData({ diet: opt.value })}
                />
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              {ENERGY_OPTIONS.map((opt) => (
                <OptionCard
                  key={opt.value}
                  {...opt}
                  selected={data.homeEnergy === opt.value}
                  onClick={() => updateData({ homeEnergy: opt.value })}
                />
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="mb-3 text-sm font-medium text-[#F8FAFC]">
                  How often do you fly or take long trips?
                </h2>
                <div className="space-y-3">
                  {TRAVEL_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={data.travel === opt.value}
                      onClick={() => updateData({ travel: opt.value })}
                    />
                  ))}
                </div>
              </div>
              <div>
                <h2 className="mb-3 text-sm font-medium text-[#F8FAFC]">
                  How would you describe your shopping habits?
                </h2>
                <div className="space-y-3">
                  {SHOPPING_OPTIONS.map((opt) => (
                    <OptionCard
                      key={opt.value}
                      {...opt}
                      selected={data.shopping === opt.value}
                      onClick={() => updateData({ shopping: opt.value })}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && isOnboardingComplete(data) && (
            <div className="space-y-3">
              {(
                [
                  ["transport", data.transport],
                  ["diet", data.diet],
                  ["homeEnergy", data.homeEnergy],
                  ["travel", data.travel],
                  ["shopping", data.shopping],
                ] as [keyof OnboardingData, string][]
              ).map(([field, value]) => (
                <div
                  key={field}
                  className="flex items-center justify-between rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] px-5 py-4"
                >
                  <span className="text-sm capitalize text-[#94A3B8]">
                    {field === "homeEnergy"
                      ? "Home Energy"
                      : field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <span className="text-sm font-medium text-[#F8FAFC]">
                    {getOptionLabel(field, value)}
                  </span>
                </div>
              ))}
              <p className="pt-2 text-center text-xs text-[#94A3B8]">
                Ready to generate your Carbon Twin from this profile
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-4">
        <Button
          variant="ghost"
          onClick={goBack}
          disabled={step === 1 || generating}
          className={step === 1 ? "invisible" : ""}
        >
          <ArrowLeft />
          Back
        </Button>

        {step < 5 ? (
          <Button variant="glow" onClick={goNext} disabled={!canProceed()}>
            Continue
            <ArrowRight />
          </Button>
        ) : (
          <Button
            variant="glow"
            onClick={handleGenerate}
            disabled={!canProceed() || generating}
            className="min-w-[200px]"
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.span>
                Generating Twin...
              </span>
            ) : (
              <>
                Generate My Twin
                <Sparkles />
              </>
            )}
          </Button>
        )}
      </div>
    </OnboardingShell>
  );
}
