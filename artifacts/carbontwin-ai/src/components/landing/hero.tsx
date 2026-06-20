
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/shared/container";
import { TwinPreview } from "@/components/landing/twin-preview";

const storyBeats = [
  {
    act: "01",
    title: "You live",
    text: "Every commute, meal, and purchase emits carbon silently.",
  },
  {
    act: "02",
    title: "We mirror",
    text: "Gemini builds a living twin that reflects your real footprint.",
  },
  {
    act: "03",
    title: "You improve",
    text: "Simulate futures, scan receipts, hear your twin guide you.",
  },
];

const headlineWords = ["Meet", "your", "Carbon", "Twin"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-8 sm:pt-36 sm:pb-12 bg-[#F8FAFC]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-[#F8FAFC] to-[#F8FAFC]" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-[100px] pointer-events-none" />
      <Container className="relative z-10 max-w-[1280px]">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs sm:text-sm bg-blue-50 text-[#2563EB] hover:bg-blue-100 border border-blue-100 transition-colors shadow-sm">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-[#3B82F6]" />
                PromptWars Challenge 3 · AI Carbon Intelligence
              </Badge>

              <h1
                className="font-display text-balance text-4xl font-bold leading-[1.05] tracking-tight text-[#0F172A] sm:text-5xl xl:text-6xl"
                aria-label="Meet your Carbon Twin"
              >
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mr-[0.25em] inline-block last:mr-0"
                  >
                    {word === "Carbon" || word === "Twin" ? (
                      <span className="text-[#2563EB]">{word}</span>
                    ) : (
                      word
                    )}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-[#64748B] sm:text-lg"
              >
                Climate data is abstract. Your twin makes it{" "}
                <span className="font-medium text-[#0F172A]">personal</span>,{" "}
                <span className="font-medium text-[#0F172A]">visual</span>, and{" "}
                <span className="font-medium text-[#0F172A]">actionable</span>{" "}
                — powered by Gemini multimodal AI.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-8 space-y-3"
              >
                {storyBeats.map((beat) => (
                  <div
                    key={beat.act}
                    className="group flex items-start gap-4 rounded-[16px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:shadow-[0_8px_24px_rgba(37,99,235,0.06)] hover:border-slate-200"
                  >
                    <span className="font-mono text-xs font-bold text-[#3B82F6]/60">
                      {beat.act}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#0F172A]">
                        {beat.title}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-[#64748B]">
                        {beat.text}
                      </p>
                    </div>
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#2563EB]" />
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
              >
                <Button size="xl" asChild className="bg-[#2563EB] hover:bg-[#3B82F6] text-white shadow-sm transition-all hover:shadow-md border border-transparent font-medium">
                  <Link href="/onboarding">
                    Create Your Twin
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="xl" asChild className="bg-white text-[#0F172A] hover:bg-slate-50 border-slate-200 shadow-sm transition-all hover:shadow-md font-medium">
                  <a href="#demo">
                    <Play className="mr-2 h-4 w-4" />
                    Watch Demo
                  </a>
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="mt-4 text-xs font-medium text-[#64748B]"
              >
                Full judge demo in under 3 minutes · No credit card
              </motion.p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative lg:pl-4"
          >
            <div className="pointer-events-none absolute -inset-8 rounded-full bg-white/40 blur-3xl" />
            <TwinPreview />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

