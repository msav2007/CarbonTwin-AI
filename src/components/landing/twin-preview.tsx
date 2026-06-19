"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Car,
  Gauge,
  Leaf,
  MessageCircle,
  ScanLine,
  TrendingUp,
  Utensils,
  Zap,
} from "lucide-react";
import { useCountUp } from "@/hooks/use-count-up";

const categories = [
  { label: "Transport", pct: 34, color: "hsl(152 68% 48%)", icon: Car },
  { label: "Diet", pct: 28, color: "hsl(172 55% 42%)", icon: Utensils },
  { label: "Energy", pct: 22, color: "hsl(160 50% 38%)", icon: Zap },
  { label: "Shopping", pct: 16, color: "hsl(140 45% 45%)", icon: Leaf },
];

function TwinOrb() {
  return (
    <div className="relative mx-auto flex h-44 w-44 items-center justify-center sm:h-52 sm:w-52">
      <div
        className="absolute inset-0 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, hsl(152 68% 48% / 0.35) 0%, transparent 70%)",
          animation: "pulse-ring 4s ease-in-out infinite",
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
          stroke="hsl(152 68% 48% / 0.15)"
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="72"
          stroke="hsl(152 68% 48% / 0.25)"
          strokeWidth="1"
          className="twin-ring origin-center"
          style={{ transformOrigin: "100px 100px" }}
        />
        <circle
          cx="100"
          cy="100"
          r="58"
          stroke="hsl(172 55% 42% / 0.2)"
          strokeWidth="1"
          className="twin-ring-reverse origin-center"
          style={{ transformOrigin: "100px 100px" }}
        />
        {categories.map((cat, i) => {
          const angle = (i * 90 - 90) * (Math.PI / 180);
          const x = 100 + Math.cos(angle) * 78;
          const y = 100 + Math.sin(angle) * 78;
          return (
            <circle
              key={cat.label}
              cx={x}
              cy={y}
              r="4"
              fill={cat.color}
              opacity="0.8"
            />
          );
        })}
      </svg>

      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-28 w-28 flex-col items-center justify-center rounded-full sm:h-32 sm:w-32"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, hsl(152 68% 55%), hsl(160 50% 25%) 60%, hsl(160 40% 12%))",
          boxShadow:
            "0 0 60px hsl(152 68% 48% / 0.4), inset 0 2px 20px hsl(0 0% 100% / 0.15)",
        }}
      >
        <span className="font-display text-2xl font-bold text-white sm:text-3xl">
          4.1
        </span>
        <span className="text-[10px] font-medium uppercase tracking-widest text-white/70">
          tonnes/yr
        </span>
      </motion.div>
    </div>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setDisplayed(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {displayed}
      <span className="ml-0.5 inline-block h-3.5 w-0.5 animate-pulse bg-primary" />
    </span>
  );
}

export function TwinPreview() {
  const footprint = useCountUp({ end: 4.1, duration: 2200, decimals: 1 });
  const savings = useCountUp({ end: 12, duration: 1800, suffix: "kg" });
  const reduction = useCountUp({ end: 8, duration: 1600, suffix: "%" });

  const twinMessage =
    "Your transport choices saved 12kg CO₂ this week. Swap one car trip for transit — I'd drop 8% lighter!";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-b from-emerald-500/20 via-teal-500/5 to-transparent opacity-80 blur-2xl" />

      <div className="glass-strong relative overflow-hidden rounded-[1.75rem] glow-emerald">
        <div className="absolute inset-x-0 top-0 h-px glow-line" />

        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/60" />
            </div>
            <span className="font-mono text-[11px] text-muted-foreground">
              carbontwin.ai · live twin
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-400">
              Syncing
            </span>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
          <div className="border-b border-white/[0.06] p-6 lg:border-b-0 lg:border-r lg:p-8">
            <TwinOrb />

            <div className="mt-6 text-center">
              <p className="font-display text-lg font-bold">Eco-Alex</p>
              <p className="text-sm text-emerald-400/90">Mindful Urbanist · Twin #A7F2</p>
            </div>

            <div className="mt-5 space-y-2.5">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <motion.div
                    key={cat.label}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="w-16 text-xs text-muted-foreground">
                      {cat.label}
                    </span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.pct}%` }}
                        transition={{ duration: 1, delay: 0.8 + i * 0.12 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-xs text-foreground/70">
                      {cat.pct}%
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 p-6 lg:p-8">
            <div className="grid grid-cols-3 gap-3">
              <div ref={footprint.ref} className="glass rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold text-primary">
                  {footprint.formatted}t
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Footprint
                </p>
              </div>
              <div ref={savings.ref} className="glass rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold text-emerald-400">
                  {savings.formatted}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  Saved
                </p>
              </div>
              <div ref={reduction.ref} className="glass rounded-xl p-3 text-center">
                <p className="font-display text-xl font-bold text-teal-300">
                  -{reduction.formatted}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                  vs. Avg
                </p>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Carbon Budget
                  </span>
                </div>
                <span className="font-display text-2xl font-bold text-emerald-400">
                  68%
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1.6, delay: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-700 via-emerald-400 to-teal-300"
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]" />
                </motion.div>
              </div>
              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>7.2 kg CO₂ used today</span>
                <span>10.5 kg limit</span>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                Twin Speaks
              </div>
              <p className="mt-2.5 min-h-[3.5rem] text-sm leading-relaxed text-foreground/90">
                &ldquo;
                <TypewriterText text={twinMessage} />
                &rdquo;
              </p>
            </div>

            <div className="flex gap-2">
              {[
                { icon: TrendingUp, label: "2030 → 3.2t" },
                { icon: ScanLine, label: "3 receipts" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="glass flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5"
                >
                  <Icon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
