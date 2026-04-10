import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthProvider from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "AureoTravels - Explore Rajasthan & India", template: "%s | AureoTravels" },
  description: "Explore Rajasthan destinations like Udaipur, Jaisalmer, Ajmer, and Bikaner along with India's Golden Triangle. Discover curated travel experiences and tour packages.",
  keywords: ["rajasthan tour packages", "golden triangle india", "delhi agra jaipur tour", "india travel packages"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('aureo-theme')||'light';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();` }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-black text-gray-900 dark:text-white transition-colors duration-300`}>
        <AuthProvider>
          <ThemeProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster position="top-right" toastOptions={{ duration: 4000, style: { background: "#1f2937", color: "#fff", borderRadius: "12px" } }} />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
