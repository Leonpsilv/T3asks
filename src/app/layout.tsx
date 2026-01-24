import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "T3ASKS",
  description: "Gerencie as suas tarefas",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#e2f6ae] to-[#050b01]">
          <TRPCReactProvider>
            {children}
          </TRPCReactProvider>
        </main>
      </body>
    </html>
  );
}
