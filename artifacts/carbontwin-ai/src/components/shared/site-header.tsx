import { Link } from "wouter";
import { Cpu } from "lucide-react";
import { Container } from "@/components/shared/container";

interface SiteHeaderProps {
  rightSlot?: React.ReactNode;
}

export function SiteHeader({ rightSlot }: SiteHeaderProps) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-primary/10">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <span className="font-display font-bold text-foreground">
            Carbon<span className="text-primary">Twin</span>
          </span>
        </Link>
        {rightSlot}
      </Container>
    </header>
  );
}
