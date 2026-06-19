"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, X } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ProgressBar } from "@/components/onboarding/progress-bar";

interface OnboardingShellProps {
  step: number;
  children: React.ReactNode;
}

export function OnboardingShell({ step, children }: OnboardingShellProps) {
  return (
    <div className="relative min-h-screen bg-[#08111B]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.3]" />
        <div className="vignette absolute inset-0" />
      </div>

      <header className="border-b border-cyan-500/[0.06] bg-[#08111B]/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-[#F8FAFC]">
              Carbon<span className="text-primary">Twin</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-[#94A3B8] transition-colors hover:bg-white/5 hover:text-[#F8FAFC]"
          >
            <X className="h-4 w-4" />
            Exit
          </Link>
        </Container>
      </header>

      <Container className="py-8 sm:py-12">
        <div className="mx-auto max-w-2xl">
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
      </Container>
    </div>
  );
}
