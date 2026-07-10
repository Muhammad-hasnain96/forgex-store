import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-oswald" });

export const metadata: Metadata = {
  title: "SilkLane — Pakistani Fashion",
  description: "SilkLane — Online Pakistani clothing store for ladies and gents shalwar kameez, kurtas, and formal wear.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable}`}>
      <body>
        <Providers>
          <div id="app" className="max-w-[1200px] mx-auto pb-16">
            <Header />
            <main className="px-8 py-10">{children}</main>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
