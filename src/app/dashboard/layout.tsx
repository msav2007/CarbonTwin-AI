"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, LayoutDashboard, Target, Activity, Settings, GitCompare, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Coach", href: "/dashboard/coach", icon: Target },
    { name: "Simulator", href: "/dashboard/simulator", icon: Activity },
    { name: "What-If Engine", href: "/dashboard/what-if", icon: GitCompare },
    { name: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#08152F] text-white hidden md:flex md:flex-col">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Cpu className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-semibold text-white">
              CarbonTwin
            </span>
          </Link>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto px-4 py-6">
          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-white"
                      : "text-slate-300 hover:bg-[#102A56] hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:bg-[#102A56] hover:text-white cursor-pointer">
            <Settings className="h-5 w-5 text-slate-400" />
            Settings
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-64">
        <div className="min-h-screen p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}
