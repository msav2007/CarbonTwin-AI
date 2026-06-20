
import { motion } from "framer-motion";
import {
  Clock,
  Gauge,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { LIVE_FEATURES } from "@/lib/landing/content";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/landing/section-header";

const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  TrendingUp,
  Clock,
  MessageCircle,
  Gauge,
  Leaf,
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <Container>
        <SectionHeader
          eyebrow="Live Product"
          title={
            <>
              Built for decisions, not{" "}
              <span className="text-gradient">climate theater.</span>
            </>
          }
          description="Every capability on this page exists in the product right now and is driven by the inputs each user provides."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LIVE_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <motion.div key={feature.id} variants={item}>
                <Card className="group relative h-full overflow-hidden border-border glass transition-all duration-500 hover:-translate-y-1.5 hover:border-border hover:glass hover:shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardHeader className="relative pb-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/15 bg-primary/10 transition-all duration-300 group-hover:scale-105 group-hover:border-border group-hover:bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground/50">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
