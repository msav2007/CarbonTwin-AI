import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        brand: {
          bg: "#08111B",
          primary: "#00D4FF",
          accent: "#7DF9FF",
          text: "#F8FAFC",
          muted: "#94A3B8",
          success: "#22C55E",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        marquee: "marquee 30s linear infinite",
        "spin-slow": "spin 20s linear infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(1.04)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, hsl(192 100% 50% / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(192 100% 50% / 0.04) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse 70% 55% at 50% -10%, hsl(192 100% 50% / 0.14), transparent 70%)",
        "radial-glow-bottom":
          "radial-gradient(ellipse 60% 40% at 50% 110%, hsl(210 90% 55% / 0.1), transparent 70%)",
      },
      backgroundSize: {
        grid: "64px 64px",
      },
      boxShadow: {
        cyan: "0 0 40px -8px hsl(192 100% 50% / 0.4)",
        "cyan-sm": "0 0 20px -4px hsl(192 100% 50% / 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
