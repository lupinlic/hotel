"use client";
import Header from "@/components/shared/components/Header";
import Footer from "@/components/shared/components/Footer";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: any) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system">
      <Header />
      {children}
      <Footer />
    </NextThemesProvider>
  );
}
