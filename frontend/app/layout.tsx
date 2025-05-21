import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToasterProvider } from "@/components/providers/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DeepDoc - PDF Reader with LLM Assistance",
  description: "A cross-platform PDF reader with LLM assistance for document analysis and translation",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <ToasterProvider />
      </body>
    </html>
  )
}
