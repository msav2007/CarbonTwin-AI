import Link from "next/link";
import { Cpu } from "lucide-react";
import { Container } from "@/components/shared/container";
import { JourneyLink } from "@/components/shared/journey-link";
import { Separator } from "@/components/ui/separator";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
];

export function Footer() {
  return (
    <footer className="border-t border-cyan-500/[0.06] bg-[#060e16]/80">
      <Container className="py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-[#F8FAFC]">
                Carbon<span className="text-primary">Twin</span> AI
              </span>
              <p className="text-xs text-[#94A3B8]">
                Carbon intelligence, personalized.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
              >
                {link.label}
              </Link>
            ))}
            <JourneyLink className="text-sm text-[#94A3B8] transition-colors hover:text-[#F8FAFC]">
              Start onboarding
            </JourneyLink>
          </nav>
        </div>

        <Separator className="my-8 bg-cyan-500/[0.06]" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-[#94A3B8] sm:flex-row">
          <p>PromptWars Challenge 3 · National Hackathon 2026</p>
          <p className="font-mono text-xs">
            Next.js · TypeScript · Framer Motion · Vercel
          </p>
        </div>
      </Container>
    </footer>
  );
}
