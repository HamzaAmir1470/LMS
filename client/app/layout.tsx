import { Geist, Geist_Mono, Poppins, Josefin_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./utils/theme-provider";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "E-Learning",
  description:
    "E-Learning is a platform for students to learn and get help from teachers.",
  keywords: ["Programming", "MERN", "Redux", "Machine Learning"],
};

// Configured to match the exact casing of your Tailwind setup
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
      suppressHydrationWarning /* Prevents flash warnings from next-themes hydration */
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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-center" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
