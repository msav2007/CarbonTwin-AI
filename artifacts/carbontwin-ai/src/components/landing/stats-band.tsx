
import { motion } from "framer-motion";
import { Compass, Gauge, Sparkles, TrendingDown } from "lucide-react";
import { Container } from "@/components/shared/container";
import { LANDING_STATS } from "@/lib/landing/content";

const statIcons = [Sparkles, Gauge, TrendingDown, Compass];

export function StatsBand() {
  return (
    <section className="relative py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px glow-line opacity-50" />
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-primary">
            CarbonTwin at a glance
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Personal guidance with a{" "}
            <span className="text-gradient">clear reduction path.</span>
          </h2>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {LANDING_STATS.map((stat, index) => {
            const Icon = statIcons[index] ?? Sparkles;

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:border-border hover:glass hover:shadow-sm"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/10 glass">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
                    {stat.context}
                  </span>
                </div>
                <div className="mt-5">
                  <p className="font-display text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                    {stat.value}
                  </p>
                </div>
                <p className="mt-4 text-sm font-medium text-foreground/90">
                  {stat.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
