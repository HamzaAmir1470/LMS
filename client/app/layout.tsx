import { Geist, Geist_Mono, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./Provider";


export const metadata: Metadata = {
  title: "DevLearn",
  description:
    "DevLearn is a platform for students to learn and get help from teachers.",
  keywords: ["Programming", "MERN", "Redux", "Machine Learning"],
};

const poppins = Poppins({
  variable: "--font-Poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const josefinSans = Josefin_Sans({
  variable: "--font-Josefin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className={`
          ${poppins.variable}
          ${josefinSans.variable}
          min-h-full
          flex
          flex-col
          bg-white
          bg-no-repeat
          dark:bg-gradient-to-b
          dark:from-gray-900
          dark:to-black
          transition-colors
          duration-300
        `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
