"use client";

export function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-radial-glow-bottom" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.35]" />
      <div className="noise absolute inset-0" />

      <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] animate-pulse-glow rounded-full bg-emerald-500/10 blur-[120px]" />
      <div
        className="absolute -right-32 top-1/3 h-[600px] w-[600px] animate-pulse-glow rounded-full bg-teal-500/10 blur-[140px]"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 animate-pulse-glow rounded-full bg-emerald-600/8 blur-[100px]"
        style={{ animationDelay: "4s" }}
      />
    </div>
  );
}
