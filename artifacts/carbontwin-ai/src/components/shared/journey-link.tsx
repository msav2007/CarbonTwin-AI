
import { Link, type LinkProps } from "wouter";
import { useOnboardingStore } from "@/store/onboarding";

interface JourneyLinkProps extends Omit<LinkProps, "href"> {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  resumeChildren?: React.ReactNode;
}

export function JourneyLink({
  children,
  className,
  onClick,
  resumeChildren,
  ...props
}: JourneyLinkProps) {
  const { hasHydrated, result } = useOnboardingStore();
  const hasJourney = hasHydrated && Boolean(result);

  return (
    <Link
      {...props}
      href={hasJourney ? "/dashboard" : "/onboarding"}
      className={className}
      onClick={onClick}
    >
      {hasJourney ? resumeChildren ?? children : children}
    </Link>
  );
}
