import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nocturne OS",
  description: "Unified productivity and wellness operating system.",
};

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { CommandPalette } from "@/components/command-palette";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans text-foreground bg-background`}
      >
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col overflow-auto bg-white">
              <header className="flex h-12 shrink-0 items-center gap-2 px-4 sticky top-0 bg-white/80 backdrop-blur-sm z-30 transition-all">
                <SidebarTrigger className="-ml-1" />
              </header>
              <main className="flex-1 w-full max-w-[1400px] mx-auto p-6 md:p-12 lg:p-16 transition-all duration-500">
                {children}
              </main>
            </div>
          </SidebarInset>
          <CommandPalette />
        </SidebarProvider>
      </body>
    </html>
  );
}
