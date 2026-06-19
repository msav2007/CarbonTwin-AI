"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Pencil,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LiveFootprintPreview } from "@/components/onboarding/live-footprint-preview";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionCard } from "@/components/onboarding/option-card";
import {
  ENERGY_OPTIONS,
  FOOD_OPTIONS,
  getOptionLabel,
  HOUSEHOLD_OPTIONS,
  MOTIVATION_OPTIONS,
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

const GENERATION_STAGES = [
  "Reading lifestyle signals",
  "Estimating annual CO2",
  "Finding your biggest levers",
  "Assembling Carbon Twin",
];

const REVIEW_ITEMS: {
  field: keyof OnboardingData;
  label: string;
  step: number;
}[] = [
  { field: "transport", label: "Transport", step: 1 },
  { field: "diet", label: "Food", step: 2 },
  { field: "homeEnergy", label: "Home energy", step: 3 },
  { field: "household", label: "Household", step: 3 },
  { field: "travel", label: "Travel", step: 4 },
  { field: "shopping", label: "Shopping", step: 4 },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-sm font-medium text-[#F8FAFC]">{children}</h2>
  );
}

export function OnboardingWizard() {
  const router = useRouter();
  const { step, data, setStep, updateData, setResult } = useOnboardingStore();
  const [direction, setDirection] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);

  const currentStep = Math.min(Math.max(step, 1), STEP_META.length);
  const meta = STEP_META[currentStep - 1];

  const goNext = () => {
    setDirection(1);
    setStep(Math.min(currentStep + 1, STEP_META.length));
  };

  const goBack = () => {
    setDirection(-1);
    setStep(Math.max(currentStep - 1, 1));
  };

  const jumpToStep = (targetStep: number) => {
    if (generating) return;
    setDirection(targetStep > currentStep ? 1 : -1);
    setStep(targetStep);
  };

  const lifestyleComplete = Boolean(
    data.transport &&
      data.diet &&
      data.homeEnergy &&
      data.household &&
      data.travel &&
      data.shopping
  );

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return !!data.transport;
      case 2:
        return !!data.diet;
      case 3:
        return !!data.homeEnergy && !!data.household;
      case 4:
        return !!data.travel && !!data.shopping;
      case 5:
        return lifestyleComplete && !!data.name?.trim() && !!data.motivation;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    if (!isOnboardingComplete(data)) return;
    setGenerating(true);
    setDirection(1);

    for (let i = 0; i < GENERATION_STAGES.length; i++) {
      setGenerationStage(i);
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 520 : 620));
    }

    const profile: OnboardingData = {
      ...data,
      name: data.name.trim(),
    };

    updateData({ name: profile.name });
    setResult(calculateCarbonResult(profile));
    router.push("/onboarding/reveal");
  };

  return (
    <OnboardingShell step={currentStep}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <section className="min-w-0">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-8">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                  Signal {currentStep} / {STEP_META.length} - {meta.title}
                </p>
                <h1 className="mt-2 font-display text-2xl font-bold text-[#F8FAFC] sm:text-3xl">
                  {meta.subtitle}
                </h1>
              </div>

              {currentStep === 1 && (
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

              {currentStep === 2 && (
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

              {currentStep === 3 && (
                <div className="space-y-8">
                  <div>
                    <SectionLabel>Home energy intensity</SectionLabel>
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
                  </div>

                  <div>
                    <SectionLabel>How is that home energy shared?</SectionLabel>
                    <div className="space-y-3">
                      {HOUSEHOLD_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.value}
                          {...opt}
                          selected={data.household === opt.value}
                          onClick={() => updateData({ household: opt.value })}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <div>
                    <SectionLabel>
                      How often do you fly or take long trips?
                    </SectionLabel>
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
                    <SectionLabel>
                      How would you describe your shopping habits?
                    </SectionLabel>
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

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-cyan-400/[0.12] bg-white/[0.03] p-5">
                    <label
                      htmlFor="carbon-twin-name"
                      className="flex items-center gap-2 text-sm font-medium text-[#F8FAFC]"
                    >
                      <UserRound className="h-4 w-4 text-primary" />
                      What should your twin call you?
                    </label>
                    <input
                      id="carbon-twin-name"
                      value={data.name ?? ""}
                      maxLength={32}
                      autoComplete="given-name"
                      placeholder="Your name or nickname"
                      onChange={(event) =>
                        updateData({ name: event.target.value })
                      }
                      className="mt-3 h-12 w-full rounded-xl border border-cyan-500/15 bg-[#07101A] px-4 text-sm text-[#F8FAFC] outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div>
                    <SectionLabel>
                      What should your Carbon Twin optimize for first?
                    </SectionLabel>
                    <div className="space-y-3">
                      {MOTIVATION_OPTIONS.map((opt) => (
                        <OptionCard
                          key={opt.value}
                          {...opt}
                          selected={data.motivation === opt.value}
                          onClick={() => updateData({ motivation: opt.value })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/[0.12] bg-white/[0.025] p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <h2 className="font-display text-lg font-semibold text-[#F8FAFC]">
                        Lifestyle profile
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {REVIEW_ITEMS.map((item) => {
                        const value = data[item.field];

                        return (
                          <div
                            key={item.field}
                            className="flex items-center justify-between gap-4 rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-[0.16em] text-[#94A3B8]">
                                {item.label}
                              </p>
                              <p className="mt-1 truncate text-sm font-medium text-[#F8FAFC]">
                                {value
                                  ? getOptionLabel(item.field, value)
                                  : "Not selected"}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => jumpToStep(item.step)}
                              disabled={generating}
                              aria-label={`Edit ${item.label}`}
                            >
                              <Pencil />
                              Edit
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {generating && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl border border-primary/30 bg-cyan-500/[0.08] p-5"
                    >
                      <div className="flex items-center gap-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
                        >
                          <Sparkles className="h-5 w-5" />
                        </motion.div>
                        <div>
                          <p className="text-sm font-medium text-[#F8FAFC]">
                            {GENERATION_STAGES[generationStage]}
                          </p>
                          <p className="text-xs text-[#94A3B8]">
                            Building your reveal from live carbon signals.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7DF9FF]"
                          animate={{
                            width: `${
                              ((generationStage + 1) /
                                GENERATION_STAGES.length) *
                              100
                            }%`,
                          }}
                          transition={{ duration: 0.4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              onClick={goBack}
              disabled={currentStep === 1 || generating}
              className={currentStep === 1 ? "invisible" : ""}
            >
              <ArrowLeft />
              Back
            </Button>

            {currentStep < STEP_META.length ? (
              <Button variant="glow" onClick={goNext} disabled={!canProceed()}>
                Continue
                <ArrowRight />
              </Button>
            ) : (
              <Button
                variant="glow"
                onClick={handleGenerate}
                disabled={!canProceed() || generating}
                className="min-w-[210px]"
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Sparkles className="h-4 w-4" />
                    </motion.span>
                    Generating Twin
                  </span>
                ) : (
                  <>
                    Reveal My Twin
                    <Sparkles />
                  </>
                )}
              </Button>
            )}
          </div>
        </section>

        <LiveFootprintPreview data={data} />
      </div>
    </OnboardingShell>
  );
}
