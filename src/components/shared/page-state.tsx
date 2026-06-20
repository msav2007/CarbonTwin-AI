import { motion } from "framer-motion";

interface PageStateProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
}

export function PageState({
  eyebrow,
  title,
  description,
  actions,
}: PageStateProps) {
  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-radial-glow" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.25]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong max-w-xl rounded-3xl p-8 text-center"
      >
        <p className="font-mono text-xs uppercase tracking-[0.24em] text-primary">
          {eyebrow}
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold text-foreground">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
        {actions ? <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div> : null}
      </motion.div>
    </div>
  );
}
