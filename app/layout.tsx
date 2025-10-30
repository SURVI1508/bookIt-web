import type { Metadata } from "next";
import { Kumbh_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/next";
const nunito = Kumbh_Sans({
  weight: ["300", "400", "600", "500", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookIt: Experiences & Slots",
  description:
    "Web application where users can explore travel experiences,select available slots, and complete bookings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={nunito.className}>
        <Toaster />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
