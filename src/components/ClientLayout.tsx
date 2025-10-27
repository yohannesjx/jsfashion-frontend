"use client"

import { usePathname } from "next/navigation"
import { VendureProvider } from "@/lib/vendure"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isPDP = pathname.startsWith("/products/")

  return (
    <VendureProvider>
      <>
        {!isPDP && <></>}
        {children}
      </>
    </VendureProvider>
  )
}