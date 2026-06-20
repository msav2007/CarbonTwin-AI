import Link from "next/link";
import { Cpu } from "lucide-react";
import { Container } from "@/components/shared/container";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-[#08111B]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora absolute inset-0" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-[0.25]" />
        <div className="absolute inset-0 bg-radial-glow" />
      </div>

      <header className="sticky top-0 z-50 border-b border-cyan-500/[0.06] bg-[#08111B]/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <span className="font-display font-bold text-[#F8FAFC]">
              Carbon<span className="text-primary">Twin</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium text-[#94A3B8]">
            <Link href="/dashboard" className="transition-colors hover:text-[#F8FAFC]">Overview</Link>
            <Link href="/dashboard/coach" className="transition-colors hover:text-[#F8FAFC]">AI Coach</Link>
            <Link href="/dashboard/simulator" className="transition-colors hover:text-[#F8FAFC]">Simulator</Link>
            <Link href="/dashboard/what-if" className="transition-colors hover:text-[#F8FAFC]">What-If Engine</Link>
            <Link href="/dashboard/progress" className="transition-colors hover:text-[#F8FAFC]">Progress</Link>
          </nav>
        </Container>
      </header>

      {children}
    </div>
  );
}
