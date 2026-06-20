"use client";

import { motion } from "framer-motion";
import { Check, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMPACT_COLORS } from "@/lib/onboarding/options";

interface OptionCardProps {
  label: string;
  description: string;
  icon: LucideIcon;
  impact: "low" | "medium" | "high";
  name: string;
  badge?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({
  label,
  description,
  icon: Icon,
  impact,
  name,
  badge,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      role="radio"
      aria-checked={selected}
      aria-label={`${name}: ${label}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "group relative w-full rounded-2xl border p-4 text-left transition-all duration-200 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/25 sm:p-5",
        selected
          ? "border-primary/50 bg-primary/10 shadow-sm"
          : "border-border glass hover:border-border hover:glass"
      )}
    >
      {selected && (
        <motion.div
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-primary"
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Check className="h-3.5 w-3.5 text-primary-foreground" />
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors",
            selected
              ? "border-primary/30 bg-primary/15"
              : "border-cyan-500/10 bg-primary/10 group-hover:border-border"
          )}
        >
          <Icon
            className={cn(
              "h-5 w-5",
              selected ? "text-primary" : "text-muted-foreground"
            )}
          />
        </div>
        <div className="min-w-0 flex-1 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{label}</p>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                IMPACT_COLORS[impact]
              )}
            >
              {badge ?? `${impact} impact`}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </motion.button>
  );
}
