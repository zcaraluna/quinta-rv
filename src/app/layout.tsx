import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const raleway = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Casa Quinta RV",
  description: "Un lugar para divertirte con la familia y amigos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${raleway.className} antialiased relative min-h-screen overflow-x-hidden bg-background`}>
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          {/* Large Amber Sphere */}
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] animate-pulse duration-[10s]" />
          {/* Large Greenish/Emerald Sphere */}
          <div className="absolute top-[40%] -right-[10%] w-[45%] h-[45%] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse duration-[8s]" />
          {/* Small Amber Sphere */}
          <div className="absolute -bottom-[5%] left-[20%] w-[30%] h-[30%] rounded-full bg-primary/5 blur-[80px]" />
        </div>

        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
