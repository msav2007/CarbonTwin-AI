"use client";

import { motion } from "framer-motion";
import { Activity, Gauge, Radar, SignalHigh } from "lucide-react";
import {
  calculatePartialCarbonEstimate,
  formatTonnes,
} from "@/lib/carbon/calculator";
import type { CategoryBreakdown } from "@/lib/carbon/types";
import type { OnboardingData } from "@/types";
import { cn } from "@/lib/utils";

interface LiveFootprintPreviewProps {
  data: Partial<OnboardingData>;
}

const PREVIEW_ROWS: {
  key: keyof CategoryBreakdown;
  label: string;
  color: string;
}[] = [
  { key: "transport", label: "Transport", color: "#00D4FF" },
  { key: "food", label: "Food", color: "#22C55E" },
  { key: "home", label: "Home", color: "#7DF9FF" },
  { key: "travel", label: "Travel", color: "#A78BFA" },
  { key: "shopping", label: "Shopping", color: "#F59E0B" },
];

export function LiveFootprintPreview({ data }: LiveFootprintPreviewProps) {
  const estimate = calculatePartialCarbonEstimate(data);
  const maxKg = Math.max(...Object.values(estimate.breakdown));

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="glass-strong overflow-hidden rounded-2xl">
        <div className="border-b border-cyan-400/[0.08] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-primary">
                Live model
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-[#F8FAFC]">
                Twin signal
              </h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <Radar className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <Activity className="h-3.5 w-3.5" />
                <span className="text-xs">Annual</span>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-[#F8FAFC]">
                {formatTonnes(estimate.annualKg)}t
              </p>
            </div>
            <div className="rounded-xl border border-cyan-500/[0.08] bg-white/[0.02] p-3">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <Gauge className="h-3.5 w-3.5" />
                <span className="text-xs">Score</span>
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-primary">
                {estimate.carbonScore}
              </p>
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Profile confidence</span>
              <span className="font-mono text-primary">
                {estimate.confidence}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#00D4FF] to-[#7DF9FF]"
                animate={{ width: `${estimate.confidence}%` }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <p className="mt-2 text-xs text-[#94A3B8]">
              {estimate.completedSignals} of {estimate.totalSignals} signals
              calibrated
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {PREVIEW_ROWS.map((row) => {
              const value = estimate.breakdown[row.key];
              const width = maxKg ? (value / maxKg) * 100 : 0;

              return (
                <div key={row.key}>
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                      <span
                        className={cn(
                          "text-[#94A3B8]",
                          estimate.selected[row.key] && "text-[#F8FAFC]"
                        )}
                      >
                        {row.label}
                      </span>
                    </div>
                    <span className="font-mono text-[#94A3B8]">
                      {value.toLocaleString()} kg
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: row.color }}
                      animate={{ width: `${width}%` }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-cyan-400/10 bg-cyan-500/[0.05] p-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[#7DF9FF]">
              <SignalHigh className="h-3.5 w-3.5" />
              Calibrating
            </div>
            <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
              Each answer updates the estimate instantly. Unknown categories use
              a neutral baseline until you select them.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
