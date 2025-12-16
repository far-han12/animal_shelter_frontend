import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/lib/authContext";
import ToastProvider from "@/components/ui/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Animal Shelter",
  description: "Adopt a pet today!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
