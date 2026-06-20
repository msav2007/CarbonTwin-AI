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
        background: "#F5F7FB",
        foreground: "#111827",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#111827",
        },
        primary: {
          DEFAULT: "#3563E9",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FAFBFD",
          foreground: "#111827",
        },
        muted: {
          DEFAULT: "#F5F7FB",
          foreground: "#6B7280",
        },
        accent: {
          DEFAULT: "#3563E9",
          foreground: "#FFFFFF",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#3563E9",
        brand: {
          navy: "#07142D",
          "navy-light": "#0B1B3F",
          "navy-lighter": "#132B5C",
          primary: "#3563E9",
          "primary-hover": "#2954D8",
          bg: "#F5F7FB",
          card: "#FFFFFF",
          surface: "#FAFBFD",
          text: "#111827",
          "text-secondary": "#6B7280",
          "text-light": "#9CA3AF",
          border: "#E5E7EB",
          "border-soft": "#EEF2F7",
        },
      },
      borderRadius: {
        lg: "16px",
        md: "12px",
        sm: "8px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        "fade-up": "fade-up 0.6s ease-out forwards",
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
      },
      boxShadow: {
        saas: "0 8px 24px rgba(0,0,0,0.08)",
        "saas-lg": "0 12px 32px rgba(0,0,0,0.10)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #07142D 0%, #0B1B3F 50%, #173A7A 100%)",
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
