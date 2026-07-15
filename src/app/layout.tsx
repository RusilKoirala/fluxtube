import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "./providers";
import { AuthProvider } from "@/components/AuthProvider";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter (
  {
    subsets: ['latin']
  }
);

export const metadata: Metadata = {
  title: "FluxTube",
  description: "Track, watch and flex your movie collection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={inter.className}
      >
        <Providers>
          <AuthProvider>
             {children}
          </AuthProvider>
          </Providers>
      </body>
    </html>
  );
}
