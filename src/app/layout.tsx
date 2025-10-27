import "./globals.css"
import type { Metadata } from "next"
import ClientLayout from "@/components/ClientLayout"

export const metadata: Metadata = {
  title: "JSFashion",
  description: "Modern fashion e-commerce powered by Medusa",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-800 min-h-screen antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}