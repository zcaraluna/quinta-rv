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
      <body className={`${raleway.className} antialiased relative min-h-screen overflow-x-hidden bg-background leading-relaxed`}>
        {/* Animated Background Lines */}
        <div className="lines-container">
          <div className="bg-line" />
          <div className="bg-line" />
          <div className="bg-line" />
          <div className="bg-line" />
          <div className="bg-line" />
        </div>

        <div className="relative z-0">
          {children}
        </div>
      </body>
    </html>
  );
}
