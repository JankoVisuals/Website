import { site } from "@/content/site";
import "./globals.css";

// Clash Display (Indian Type Foundry, free for commercial use) served by Fontshare: only the two cuts in use,
// Bold 700 for headings and Extralight 200 for the rest of the copy.
const clashDisplay = "https://api.fontshare.com/v2/css?f[]=clash-display@200,700&display=swap";

export const metadata = {
  title: site.name,
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "sr_RS",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0b0b0a",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="" />
        <link rel="stylesheet" href={clashDisplay} />
      </head>
      <body>{children}</body>
    </html>
  );
}
