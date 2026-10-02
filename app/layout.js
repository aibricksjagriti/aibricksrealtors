import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/src/ConditionalLayout";
import DeferredAnalytics from "@/src/DeferredAnalytics";
import { Toaster } from "react-hot-toast";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "700"],
});

export const metadata = {
  metadataBase: new URL("https://www.aibricksrealtors.com"),
  title: {
    default: "AI Bricks Realtors | India's First AI-Driven Real Estate Platform",
    template: "%s",
  },
  description:
    "AI Bricks Realtors is India's first AI-driven real estate platform, empowering buyers, sellers, and investors to make smarter property decisions.",
  icons: {
    icon: "/logo-mark.png",
    shortcut: "/logo-mark.png",
    apple: "/logo-mark.png",
  },
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${lato.variable} antialiased bg-[var(--background)] relative`}
      >
        {/* ✅ Google Tag Manager (noscript) - MUST be first */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-MN6PS8NQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ConditionalLayout>{children}</ConditionalLayout>
        <DeferredAnalytics />
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
