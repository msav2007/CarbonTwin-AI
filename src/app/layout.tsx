import type { Metadata, Viewport } from "next";
import { DM_Sans, Syne } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CarbonTwin AI — Your Personal Carbon Intelligence Twin",
  description:
    "AI generates your Carbon Twin, simulates future emissions, analyzes receipts, and speaks personalized climate insights. Built for PromptWars Challenge 3.",
  keywords: [
    "carbon footprint",
    "AI",
    "climate",
    "sustainability",
    "Gemini",
    "Carbon Twin",
    "hackathon",
  ],
  openGraph: {
    title: "CarbonTwin AI — Meet Your Carbon Twin",
    description:
      "AI-powered carbon intelligence for a sustainable future.",
    type: "website",
    siteName: "CarbonTwin AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonTwin AI",
    description: "Meet your AI-powered Carbon Twin",
  },
};

export const viewport: Viewport = {
  themeColor: "#08111B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${dmSans.variable} ${syne.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            classNames: {
              toast: "glass border-border font-sans",
            },
          }}
        />
      </body>
    </html>
  );
}
