"use client"
import { Heart, User, Menu, ShoppingBag } from "lucide-react"
import { useCartStore, useCartTotalItems } from "@/store/cart"
import CartSheet from "@/components/cart-sheet"
import { useRef, useEffect, useState as useStateOriginal } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { categories } from "@/data/categories"

// Utility to ensure we always have a safe handle in links
function safeHandle(h: string) {
  return encodeURIComponent(h.trim().toLowerCase())
}

export default function Header() {
  const pathname = usePathname()
  const categoryNavRef = useRef<HTMLDivElement>(null)
  const [showRightIndicator, setShowRightIndicator] = useStateOriginal(false)
  const [mounted, setMounted] = useStateOriginal(false)

  // ✅ Zustand cart state
  const totalItems = useCartTotalItems()
  const { isCartOpen, setIsCartOpen } = useCartStore();

  // ✅ Wait for client mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // ✅ Scroll management for horizontal nav
  useEffect(() => {
    const checkOverflow = () => {
      const el = categoryNavRef.current
      if (el) setShowRightIndicator(el.scrollWidth > el.clientWidth)
    }
    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    categoryNavRef.current?.addEventListener("scroll", checkOverflow)
    return () => {
      window.removeEventListener("resize", checkOverflow)
      categoryNavRef.current?.removeEventListener("scroll", checkOverflow)
    }
  }, [pathname])

  useEffect(() => {
    if (categoryNavRef.current) categoryNavRef.current.scrollLeft = 0
  }, [pathname])

  if (!mounted) return null

  return (
    <>
      {/* ✅ Top Black Banner */}
      <div className="w-full bg-black text-white text-center font-bold text-sm py-1 uppercase tracking-wide">
        FREE SHIPPING ON ALL ORDERS
      </div>

      {/* ✅ Header */}
      <header className="w-full bg-white border-b border-gray-100 text-gray-900">
        {/* ===== MOBILE HEADER ===== */}
        <div className="flex items-center justify-between md:hidden px-4 py-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="JSFashion"
              width={140}
              height={36}
              className="object-contain"
              priority
            />
          </Link>

          <div className="flex items-center gap-4 relative">
            <User className="w-5 h-5 text-gray-700 cursor-pointer hover:opacity-100 opacity-70 transition" />
            <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:opacity-100 opacity-70 transition" />

         {/* ✅ Cart Icon with Counter (Mobile + Works as Navigation) */}
<Link
  href="/cart"
  className="relative focus:outline-none"
  aria-label="Go to Cart"
>
  <ShoppingBag className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
  {mounted && totalItems > 0 && (
    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
      {totalItems}
    </span>
  )}
</Link>

            <Menu className="w-5 h-5 text-gray-700 cursor-pointer hover:opacity-100 opacity-70 transition" />
          </div>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 lg:px-12 py-3">
          <Link href="/" className="flex items-center gap-2 mb-3 md:mb-0">
            <Image
              src="/logo.svg"
              alt="JSFashion"
              width={160}
              height={40}
              className="object-contain"
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-5 ml-auto">
            <User className="w-5 h-5 text-gray-700 cursor-pointer hover:opacity-100 opacity-70 transition" />
            <Heart className="w-5 h-5 text-gray-700 cursor-pointer hover:opacity-100 opacity-70 transition" />

         {/* ✅ Cart Icon with Counter (Mobile + Works as Navigation) */}
<Link
  href="/cart"
  className="relative focus:outline-none"
  aria-label="Go to Cart"
>
  <ShoppingBag className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
  {mounted && totalItems > 0 && (
    <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
      {totalItems}
    </span>
  )}
</Link>


          </div>
        </div>
      </header>

    
      
    </>
  )
}