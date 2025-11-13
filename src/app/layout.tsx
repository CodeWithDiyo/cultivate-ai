// FILE: app/layout.tsx
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/src/components/ConvexClientProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cultivate AI — AI-Powered Climate Innovation",
  description:
    "Cultivate AI empowers innovators, investors, and institutions to solve climate challenges using data-driven intelligence.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-gradient-to-b from-green-50 to-white text-gray-900 antialiased",
            inter.className
          )}
        >
          <ConvexClientProvider>
            <main className="flex flex-col min-h-screen">{children}</main>
            <Toaster />
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
