
import { motion } from "framer-motion";
import { Container } from "@/components/shared/container";
import { SectionHeader } from "@/components/landing/section-header";
import { HOW_IT_WORKS_STEPS } from "@/lib/landing/content";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-slate-200 py-24 sm:py-32 bg-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-slate-50/50" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Your Journey"
          title={
            <>
              From lifestyle signals to{" "}
              <span className="text-[#2563EB]">visible action</span>
            </>
          }
          description="A demo-ready flow that starts with your current habits and ends with a plan you can actually use."
        />

        <div className="relative mt-16 grid gap-5 sm:grid-cols-2">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[24px] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-slate-100 transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_-12px_rgba(37,99,235,0.12)] hover:border-blue-100 sm:p-7"
            >
              <div className="relative flex items-start justify-between">
                <span className="font-display text-[72px] font-black leading-none text-[#2563EB]/10 transition-colors group-hover:text-[#2563EB]/20">
                  {step.step}
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-[#64748B]">
                  {step.tag}
                </span>
              </div>

              <h3 className="relative mt-6 font-display text-xl font-bold text-[#0F172A]">
                {step.title}
              </h3>
              <p className="relative mt-2.5 text-sm leading-relaxed text-[#64748B]">
                {step.description}
              </p>

              <div className="relative mt-6 flex items-center gap-2 border-t border-slate-100 pt-5">
                <div
                  className={`h-2 w-2 rounded-full ${
                    'outcomeSuccess' in step && step.outcomeSuccess ? "bg-[#10B981]" : "bg-[#2563EB]"
                  }`}
                />
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    'outcomeSuccess' in step && step.outcomeSuccess ? "text-[#10B981]" : "text-[#2563EB]"
                  }`}
                >
                  {step.outcome}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
