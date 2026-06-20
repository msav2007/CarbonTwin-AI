import { Link } from "wouter";
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
    <footer className="border-t border-border bg-[#060e16]/80">
      <Container className="py-12">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-primary/10">
              <Cpu className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="font-display font-bold text-foreground">
                Carbon<span className="text-primary">Twin</span> AI
              </span>
              <p className="text-xs text-muted-foreground">
                Carbon intelligence, personalized.
              </p>
            </div>
          </div>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <JourneyLink className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Start onboarding
            </JourneyLink>
          </nav>
        </div>

        <Separator className="my-8 glass" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>PromptWars Challenge 3 · National Hackathon 2026</p>
          <p className="font-mono text-xs">
            Next.js · TypeScript · Framer Motion · Vercel
          </p>
        </div>
      </Container>
    </footer>
  );
}
