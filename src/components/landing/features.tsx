"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Gauge,
  MessageCircle,
  ScanLine,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { MVP_FEATURES } from "@/types";
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
  ScanLine,
  MessageCircle,
  Gauge,
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
          eyebrow="AI Arsenal"
          title={
            <>
              Not features.{" "}
              <span className="text-gradient">Superpowers.</span>
            </>
          }
          description="Each capability is a judge-demo moment — multimodal AI that you can see, hear, and interact with in real time."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {MVP_FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon] ?? Sparkles;
            return (
              <motion.div key={feature.id} variants={item}>
                <Card className="group relative h-full overflow-hidden border-white/[0.06] bg-white/[0.02] transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/25 hover:bg-white/[0.04] hover:shadow-2xl hover:shadow-primary/[0.06]">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <CardHeader className="relative pb-3">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:bg-primary/20 group-hover:ring-primary/40">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground/50">
                        0{index + 1}
                      </span>
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-sm leading-relaxed">
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
