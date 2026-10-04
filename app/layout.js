import { Bodoni_Moda, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-bodoni",
  display: "swap",
});

const body = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-schibsted",
  display: "swap",
});

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
    <html lang="sr" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
