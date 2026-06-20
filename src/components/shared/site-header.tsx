import Link from "next/link";
import { Cpu } from "lucide-react";
import { Container } from "@/components/shared/container";

interface SiteHeaderProps {
  rightSlot?: React.ReactNode;
}

export function SiteHeader({ rightSlot }: SiteHeaderProps) {
  return (
    <header className="border-b border-cyan-500/[0.06] bg-[#08111B]/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-500/10">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display font-bold text-[#F8FAFC]">
            Carbon<span className="text-primary">Twin</span>
          </span>
        </Link>
        {rightSlot}
      </Container>
    </header>
  );
}
