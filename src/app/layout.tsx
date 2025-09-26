import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/sonner";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
// import 'stream-chat-react/dist/css/v2/index.css';
import { ThemeProvider } from "@/providers/theme-provider";
import { AppLayout } from "@/components/layout/app-layout";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "CallRio - Video Conferencing",
  description: "Seamless video conferencing experience",
  icons: {
    icon: '/images/smart.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppLayout>
            {children}
          </AppLayout>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}