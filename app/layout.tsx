import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NexaPay - P2P Lending Platform",
  description: "Empowering peer-to-peer financial freedom",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/nexapay-logo-dark.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/nexapay-logo-dark.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/nexapay-logo-dark.png",
        type: "image/svg+xml",
      },
    ],
    apple: "/nexapay-logo-dark.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
