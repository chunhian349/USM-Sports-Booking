import type { Metadata } from "next";
import Head from "next/head";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar/page";
import Footer from "./footer/page";
import { Providers } from "./providers";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "USM Sports Booking",
  },
  description: "Book sports facilities at USM easily online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
          <Navbar />
          {children}
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
