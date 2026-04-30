import { Cinzel, Lato } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/src/ConditionalLayout";
import QueryProvider from "@/src/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import Script from "next/script";
import { getNavData } from "@/lib/data/nav";

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
  title: "Live The Future",
  description: "Coming Soon",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const { builders: navBuilders, locations: navLocations } = await getNavData();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WTJDZXW8');`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${cinzel.variable} ${lato.variable} antialiased bg-[var(--background)] relative`}
      >
        {/* ✅ Google Tag Manager (noscript) - MUST be first */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WTJDZXW8"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryProvider>
          <ConditionalLayout navBuilders={navBuilders} navLocations={navLocations}>
            {children}
          </ConditionalLayout>
        </QueryProvider>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
