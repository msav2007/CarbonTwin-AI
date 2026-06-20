"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cpu, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { JourneyLink } from "@/components/shared/journey-link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-cyan-500/[0.08] bg-[#08111B]/85 shadow-lg shadow-black/30 backdrop-blur-2xl"
            : "bg-transparent"
        )}
      >
        <Container className="flex h-16 items-center justify-between lg:h-[4.5rem]">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10 transition-all group-hover:border-cyan-400/40 group-hover:bg-cyan-500/15 group-hover:shadow-cyan-sm">
              <Cpu className="h-5 w-5 text-primary" />
              <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-[#F8FAFC]">
              Carbon<span className="text-primary">Twin</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-lg px-4 py-2 text-sm text-[#94A3B8] transition-colors hover:bg-cyan-500/[0.06] hover:text-[#F8FAFC]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hidden sm:inline-flex"
            >
              <a href="#demo">See the flow</a>
            </Button>
            <Button variant="glow" size="sm" asChild className="hidden sm:inline-flex">
              <JourneyLink resumeChildren="Open Dashboard">
                Get Your Twin
              </JourneyLink>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </Container>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-[#08111B]/90 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-[70] w-full max-w-xs border-l border-cyan-500/10 bg-[#0c1929] p-6 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-[#F8FAFC]">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="mt-8 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-3 text-base text-[#94A3B8] transition-colors hover:bg-cyan-500/[0.06] hover:text-[#F8FAFC]"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-3">
                <Button variant="outline" asChild className="w-full">
                  <a href="#demo" onClick={() => setMobileOpen(false)}>
                    See the flow
                  </a>
                </Button>
                <Button variant="glow" asChild className="w-full">
                  <JourneyLink
                    onClick={() => setMobileOpen(false)}
                    resumeChildren="Open Dashboard"
                  >
                    Get Your Twin
                  </JourneyLink>
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function NavbarBackground() {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-24 bg-gradient-to-b from-[#08111B] via-[#08111B]/90 to-transparent" />
  );
}
