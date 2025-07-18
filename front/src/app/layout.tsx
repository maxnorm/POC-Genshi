import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import RainbowKitAndWagmiProvider from "./RainbowKitAndWagmiProvider";
import { Toaster } from "sonner";
import Auth from "@/components/Auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GENSHI – Traceability for Critical Industrial Assets",
  description: `GENSHI is a traceability platform using blockchain and NFTs
    to certify and track critical equipment across its lifecycle.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <RainbowKitAndWagmiProvider>
          {children}
        </RainbowKitAndWagmiProvider>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            duration: 5000,
            style: {
              backgroundColor: "#000f24",
              color: '#03c0f9',
              border: '1px solid #03c0f9',
            },
          }} />
      </body>
    </html>
  );
}
