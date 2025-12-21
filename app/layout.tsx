// app/layout.tsx (ИСПРАВЛЕННЫЙ)
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import ClientLayout from "./client-layout"

const geist = Geist({ subsets: ["latin", "cyrillic"] })
const geistMono = Geist_Mono({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "ТропА",
  description: "Создавайте персонализированные маршруты для прогулок по городу",
  generator: "trails.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${geist.className} ${geistMono.className}`}>
      <body className="antialiased">
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}