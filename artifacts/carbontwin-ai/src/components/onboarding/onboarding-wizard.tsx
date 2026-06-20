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
import { useLocation } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LiveFootprintPreview } from "@/components/onboarding/live-footprint-preview";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { OptionGroup } from "@/components/onboarding/option-group";
import { PageState } from "@/components/shared/page-state";
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
import { sanitizeNameInput, validateDisplayName } from "@/lib/onboarding/validation";
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

const STEP_HELP: Record<number, string> = {
  1: "Transport sets the tone for recurring emissions, so we start with how you move every week.",
  2: "Food choices shape the daily footprint more than most people expect.",
  3: "Home energy and shared living tell us how much of your footprint is structural versus habit-based.",
  4: "Travel and shopping reveal the spikes and hidden embodied carbon in your lifestyle.",
  5: "Name your twin and choose the first goal so the assistant can coach with the right tone.",
};

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

export function OnboardingWizard() {
  const [, navigate] = useLocation();
  const {
    hasHydrated,
    step,
    data,
    setStep,
    updateData,
    setResult,
  } = useOnboardingStore();
  const [direction, setDirection] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const [nameTouched, setNameTouched] = useState(false);

  if (!hasHydrated) {
    return (
      <PageState
        eyebrow="Loading session"
        title="Restoring your carbon journey"
        description="We are syncing your saved onboarding progress so you can continue without losing context."
      />
    );
  }

  const currentStep = Math.min(Math.max(step, 1), STEP_META.length);
  const meta = STEP_META[currentStep - 1];
  const lifestyleComplete = Boolean(
    data.transport &&
      data.diet &&
      data.homeEnergy &&
      data.household &&
      data.travel &&
      data.shopping
  );
  const nameError = validateDisplayName(data.name ?? "");

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
        return lifestyleComplete && !nameError && !!data.motivation;
      default:
        return false;
    }
  };

  const handleGenerate = async () => {
    setNameTouched(true);
    if (!isOnboardingComplete(data) || nameError) return;

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
    navigate("/onboarding/reveal");
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
                <h1 className="mt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
                  {meta.subtitle}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {STEP_HELP[currentStep]}
                </p>
              </div>

              {currentStep === 1 && (
                <OptionGroup
                  legend="How do you move most weeks?"
                  name="transport"
                  options={TRANSPORT_OPTIONS}
                  selectedValue={data.transport}
                  onSelect={(transport) => updateData({ transport })}
                />
              )}

              {currentStep === 2 && (
                <OptionGroup
                  legend="Which diet best matches your current routine?"
                  name="diet"
                  options={FOOD_OPTIONS}
                  selectedValue={data.diet}
                  onSelect={(diet) => updateData({ diet })}
                />
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <OptionGroup
                    legend="Home energy intensity"
                    name="home-energy"
                    options={ENERGY_OPTIONS}
                    selectedValue={data.homeEnergy}
                    onSelect={(homeEnergy) => updateData({ homeEnergy })}
                  />
                  <OptionGroup
                    legend="How is that home energy shared?"
                    name="household"
                    options={HOUSEHOLD_OPTIONS}
                    selectedValue={data.household}
                    onSelect={(household) => updateData({ household })}
                  />
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-8">
                  <OptionGroup
                    legend="How often do you fly or take longer trips?"
                    name="travel"
                    options={TRAVEL_OPTIONS}
                    selectedValue={data.travel}
                    onSelect={(travel) => updateData({ travel })}
                  />
                  <OptionGroup
                    legend="How would you describe your shopping habits?"
                    name="shopping"
                    options={SHOPPING_OPTIONS}
                    selectedValue={data.shopping}
                    onSelect={(shopping) => updateData({ shopping })}
                  />
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="rounded-2xl glass p-5">
                    <label
                      htmlFor="carbon-twin-name"
                      className="flex items-center gap-2 text-sm font-medium text-foreground"
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
                      onBlur={() => setNameTouched(true)}
                      onChange={(event) =>
                        updateData({
                          name: sanitizeNameInput(event.target.value),
                        })
                      }
                      className="mt-3 h-12 w-full rounded-xl border border-cyan-500/15 bg-[#07101A] px-4 text-sm text-foreground outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                    />
                    {nameTouched && nameError ? (
                      <p className="mt-2 text-sm text-amber-500">{nameError}</p>
                    ) : (
                      <p className="mt-2 text-xs text-muted-foreground">
                        We use this only to personalize your twin narrative and dashboard.
                      </p>
                    )}
                  </div>

                  <OptionGroup
                    legend="What should your Carbon Twin optimize for first?"
                    name="motivation"
                    options={MOTIVATION_OPTIONS}
                    selectedValue={data.motivation}
                    onSelect={(motivation) => updateData({ motivation })}
                  />

                  <div className="rounded-2xl border border-border bg-white/[0.025] p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <h2 className="font-display text-lg font-semibold text-foreground">
                        Lifestyle profile
                      </h2>
                    </div>

                    <div className="space-y-3">
                      {REVIEW_ITEMS.map((item) => {
                        const value = data[item.field];

                        return (
                          <div
                            key={item.field}
                            className="flex items-center justify-between gap-4 rounded-xl glass px-4 py-3"
                          >
                            <div className="min-w-0">
                              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                                {item.label}
                              </p>
                              <p className="mt-1 truncate text-sm font-medium text-foreground">
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
                      className="rounded-2xl border border-primary/30 glass p-5"
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
                          <p className="text-sm font-medium text-foreground">
                            {GENERATION_STAGES[generationStage]}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Building your assistant profile from the signals you provided.
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 h-1.5 overflow-hidden rounded-full glass">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7DF9FF]"
                          animate={{
                            width: `${
                              ((generationStage + 1) / GENERATION_STAGES.length) * 100
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
