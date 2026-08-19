import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Digit Recognizer — Draw & Classify Handwritten Digits",
  description: "A minimalist handwritten digit recognition app powered by an SGD classifier trained on MNIST. Draw a digit on the 28×28 canvas and get an instant prediction.",
  keywords: ["digit recognizer", "mnist", "machine learning", "sgd classifier", "handwriting recognition", "next.js", "fastapi", "scikit-learn"],
  authors: [{ name: "Harshit" }],
  openGraph: {
    title: "Digit Recognizer — Draw & Classify Handwritten Digits",
    description: "Draw a digit on the 28×28 canvas and watch an SGD classifier trained on MNIST predict it instantly.",
    type: "website",
    siteName: "Digit Recognizer",
  },
  icons: {
    icon: "/favicon.ico",
    apple: [
      { url: "/favicon.ico", sizes: "180x180", type: "image/x-icon" }
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
