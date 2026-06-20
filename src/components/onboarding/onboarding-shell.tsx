"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { ProgressBar } from "@/components/onboarding/progress-bar";
import { SiteHeader } from "@/components/shared/site-header";

interface OnboardingShellProps {
  step: number;
  children: React.ReactNode;
}

export function OnboardingShell({ step, children }: OnboardingShellProps) {
  return (
    <div className="relative isolate min-h-screen bg-[#08111B]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.3]" />
        <div className="vignette absolute inset-0" />
      </div>

      <SiteHeader
        rightSlot={
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#F8FAFC]"
          >
            <X className="h-4 w-4" />
            Exit
          </Link>
        }
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <ProgressBar currentStep={step} />
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
