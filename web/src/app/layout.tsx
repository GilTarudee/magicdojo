import type { Metadata } from "next";
import {
  Noto_Serif_Thai,
  Chakra_Petch,
  IBM_Plex_Sans_Thai,
  IBM_Plex_Mono,
} from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-thai",
});
const chakra = Chakra_Petch({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
});
const plexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-sans-thai",
});
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

export const metadata: Metadata = {
  title: "Magic Dojo — Magic: The Gathering Singles",
  description:
    "ขาย Single Magic: The Gathering พร้อมส่งทั่วไทย · Singles, live stock, ship across Thailand.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" data-theme="dojo">
      <body
        className={`${notoSerifThai.variable} ${chakra.variable} ${plexSansThai.variable} ${plexMono.variable}`}
      >
        <StoreProvider>
          <Header />
          {children}
          <Footer />
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
