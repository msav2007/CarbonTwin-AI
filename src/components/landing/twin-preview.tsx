"use client";

import { motion } from "framer-motion";
import { Gauge, MessageCircle, ScanLine, TrendingUp } from "lucide-react";

const metrics = [
  { label: "Annual", value: "4.1t", sub: "CO₂e" },
  { label: "vs. Avg", value: "-8%", sub: "better" },
  { label: "Receipts", value: "3", sub: "scanned" },
  { label: "2030 Proj.", value: "3.2t", sub: "forecast" },
];

export function TwinPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-20 max-w-4xl"
    >
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/30 via-teal-500/10 to-emerald-500/30 opacity-60 blur-2xl" />

      <div className="glass-strong relative overflow-hidden rounded-2xl glow-emerald">
        <div className="absolute inset-x-0 top-0 h-px glow-line" />

        <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3.5">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-amber-400/70" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
          </div>
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            carbontwin.ai/dashboard
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs text-emerald-400">Live</span>
          </div>
        </div>

        <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-[4.5rem] w-[4.5rem] animate-float items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 text-3xl shadow-xl shadow-emerald-500/25">
                  🌱
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-card ring-2 ring-emerald-500/50">
                  <span className="text-[10px]">AI</span>
                </div>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Your Carbon Twin
                </p>
                <p className="font-display text-xl font-bold">Eco-Alex</p>
                <p className="text-sm text-emerald-400">Mindful Urbanist</p>
              </div>
            </div>

            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-primary" />
                Twin Speaks
              </div>
              <p className="mt-2.5 text-sm leading-relaxed text-foreground/90">
                &ldquo;Your transport choices saved{" "}
                <span className="font-medium text-emerald-400">12kg CO₂</span>{" "}
                this week. Swap one car trip for transit — I&apos;d drop{" "}
                <span className="font-medium text-emerald-400">8%</span>{" "}
                lighter!&rdquo;
              </p>
            </div>

            <div className="flex gap-2">
              <div className="glass flex flex-1 items-center gap-2 rounded-lg px-3 py-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Simulator</span>
              </div>
              <div className="glass flex flex-1 items-center gap-2 rounded-lg px-3 py-2">
                <ScanLine className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Receipts</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Gauge className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Carbon Budget</span>
                </div>
                <span className="font-display text-lg font-bold text-emerald-400">
                  68%
                </span>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "68%" }}
                  transition={{ duration: 1.4, delay: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-300"
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>7.2 kg used</span>
                <span>10.5 kg daily limit</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {metrics.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.08 }}
                  className="glass rounded-xl p-3.5 text-center transition-colors hover:border-primary/20"
                >
                  <p className="font-display text-xl font-bold text-primary">
                    {item.value}
                  </p>
                  <p className="text-xs font-medium text-foreground/80">
                    {item.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{item.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
