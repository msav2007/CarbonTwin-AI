
import { motion } from "framer-motion";
import {
  Car,
  Gauge,
  Leaf,
  MessageCircle,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";
import { calculateCarbonResult, formatTonnes } from "@/lib/carbon/calculator";
import { useOnboardingStore } from "@/store/onboarding";
import type { OnboardingData } from "@/types";

const sampleProfile: OnboardingData = {
  name: "Ava",
  transport: "mixed",
  diet: "balanced",
  homeEnergy: "medium",
  household: "couple",
  shopping: "moderate",
  travel: "occasional",
  motivation: "shrink-footprint",
};

const sampleResult = calculateCarbonResult(sampleProfile);

function TwinOrb({ annualTonnes }: { annualTonnes: string }) {
  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <div
        className="absolute inset-0 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
        }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle
          cx="100"
          cy="100"
          r="88"
          stroke="rgba(37,99,235,0.08)"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          stroke="rgba(37,99,235,0.15)"
          strokeWidth="1"
          className="twin-ring origin-center"
          style={{ transformOrigin: "100px 100px" }}
        />
        <circle
          cx="100"
          cy="100"
          r="58"
          stroke="rgba(59,130,246,0.1)"
          strokeWidth="1"
          className="twin-ring-reverse origin-center"
          style={{ transformOrigin: "100px 100px" }}
        />
      </svg>

      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full sm:h-32 sm:w-32 bg-white border border-blue-50/50 shadow-[0_8px_32px_-4px_rgba(37,99,235,0.12)]"
      >
        <span className="font-display text-2xl font-bold text-[#0F172A] sm:text-3xl">
          {annualTonnes}
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-[#64748B]">
          tonnes/yr
        </span>
      </motion.div>
    </div>
  );
}

export function TwinPreview() {
  const { hasHydrated, result } = useOnboardingStore();
  const activeResult = hasHydrated && result ? result : sampleResult;
  const isPersonal = hasHydrated && Boolean(result);
  const annual = useCountUp({
    end: activeResult.annualKg / 1000,
    duration: 1800,
    decimals: 1,
    startOnView: false,
  });
  const score = useCountUp({
    end: activeResult.carbonScore,
    duration: 1500,
    startOnView: false,
  });
  const savings = useCountUp({
    end: activeResult.recommendedActions[0]?.annualSavingsKg ?? 0,
    duration: 1600,
    suffix: "kg",
    startOnView: false,
  });

  const breakdownRows = [
    {
      label: "Transport",
      pct: activeResult.breakdownPct.transport,
      color: "#3B82F6",
      icon: Car,
    },
    {
      label: "Food",
      pct: activeResult.breakdownPct.food,
      color: "#10B981",
      icon: Utensils,
    },
    {
      label: "Home",
      pct: activeResult.breakdownPct.home,
      color: "#60A5FA",
      icon: Zap,
    },
    {
      label: "Shopping",
      pct: activeResult.breakdownPct.shopping,
      color: "#F59E0B",
      icon: Leaf,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="absolute -inset-2 rounded-[2rem] bg-blue-50/50 blur-xl opacity-60" />

      <div className="relative overflow-hidden rounded-[24px] bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.5)_inset]">
        <div className="flex items-center justify-between border-b border-slate-100 bg-white/40 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
              <div className="h-2.5 w-2.5 rounded-full bg-slate-200" />
            </div>
            <span className="font-mono text-[11px] text-[#64748B]">
              {isPersonal ? "your live twin" : "sample twin powered by the live engine"}
            </span>
          </div>
          <div className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-[#2563EB]">
            {isPersonal ? "Personalized" : "Sample"}
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-slate-100 bg-white/20 p-6 lg:border-b-0 lg:border-r lg:p-8">
            <TwinOrb annualTonnes={formatTonnes(activeResult.annualKg)} />

            <div className="mt-6 text-center">
              <p className="font-display text-lg font-bold text-[#0F172A]">
                {activeResult.twin.name}
              </p>
              <p className="text-sm font-medium text-[#2563EB]">
                {activeResult.twin.personality} · {activeResult.twin.avatarCode}
              </p>
            </div>

            <div className="mt-5 space-y-2.5">
              {breakdownRows.map((row, index) => {
                const Icon = row.icon;
                return (
                  <motion.div
                    key={row.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.45 + index * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                    <span className="w-16 text-xs font-medium text-[#64748B]">
                      {row.label}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${row.pct}%` }}
                        transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: row.color }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-xs text-[#0F172A]">
                      {row.pct}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 p-6 lg:p-8 bg-white/40">
            <div className="grid grid-cols-3 gap-3">
              <div ref={annual.ref} className="rounded-xl bg-white p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50">
                <p className="font-display text-xl font-bold text-[#0F172A]">
                  {annual.formatted}t
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider font-medium text-[#64748B]">
                  Annual
                </p>
              </div>
              <div ref={score.ref} className="rounded-xl bg-white p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50">
                <p className="font-display text-xl font-bold text-[#10B981]">
                  {score.formatted}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider font-medium text-[#64748B]">
                  Score
                </p>
              </div>
              <div ref={savings.ref} className="rounded-xl bg-white p-3 text-center shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50">
                <p className="font-display text-xl font-bold text-[#10B981]">
                  {savings.formatted}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider font-medium text-[#64748B]">
                  Top save
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-[#3B82F6]" />
                  <span className="text-xs font-medium uppercase tracking-wider text-[#64748B]">
                    Carbon Budget
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-[#0F172A]">
                  {Math.round(
                    (activeResult.dailyKg / activeResult.dailyBudgetKg) * 100
                  )}
                  %
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (activeResult.dailyKg / activeResult.dailyBudgetKg) * 100
                      )
                    )}%`,
                  }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full overflow-hidden rounded-full bg-[#2563EB]"
                />
              </div>
              <div className="mt-2 flex justify-between text-[11px] font-medium text-[#64748B]">
                <span>{activeResult.dailyKg} kg/day today</span>
                <span>{activeResult.dailyBudgetKg} kg target</span>
              </div>
            </div>

            <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100/50">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#3B82F6]">
                <MessageCircle className="h-3.5 w-3.5" />
                Coach note
              </div>
              <p className="mt-2.5 min-h-[3.5rem] text-sm leading-relaxed text-[#0F172A]">
                {activeResult.coach[0].description}
              </p>
            </div>

            <div className="flex gap-2">
              {activeResult.simulations.steady.outlook.slice(0, 2).map((outlook) => (
                <div
                  key={outlook.years}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 bg-white border border-slate-100/50 shadow-[0_2px_4px_rgba(0,0,0,0.01)]"
                >
                  <TrendingUp className="h-3.5 w-3.5 text-[#3B82F6]" />
                  <span className="text-xs font-medium text-[#64748B]">
                    {outlook.years}y {"->"} {formatTonnes(outlook.plannedAnnualKg)}t
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
