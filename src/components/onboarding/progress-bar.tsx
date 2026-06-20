"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { STEP_META } from "@/lib/onboarding/options";

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const progress = ((currentStep - 1) / (STEP_META.length - 1)) * 100;

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between text-xs">
        <span className="font-mono uppercase tracking-wider text-muted-foreground">
          Step {currentStep} of {STEP_META.length}
        </span>
        <span className="font-medium text-primary">
          {STEP_META[currentStep - 1]?.title}
        </span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full glass">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7DF9FF]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="mt-4 hidden gap-2 sm:flex">
        {STEP_META.map((step) => (
          <div
            key={step.id}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              step.id <= currentStep ? "bg-primary/60" : "glass"
            )}
          />
        ))}
      </div>
    </div>
  );
}
