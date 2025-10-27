"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, User, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { useCartStore, useCartTotalItems } from "@/store/cart";
import { categories } from "@/data/categories"; // ✅ If unused, can be safely removed

// ✅ Utility: normalize handles for URLs
function safeHandle(h: string) {
  return encodeURIComponent(h.trim().toLowerCase());
}

export default function Header() {
  const pathname = usePathname();
  const categoryNavRef = useRef<HTMLDivElement>(null);

  const [showRightIndicator, setShowRightIndicator] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ✅ Zustand state for cart
  const totalItems = useCartTotalItems();
  const { isCartOpen, setIsCartOpen } = useCartStore();

  // ✅ Wait for client mount (prevents hydration mismatch)
  useEffect(() => {
  Promise.resolve().then(() => setMounted(true));
}, []);

  // ✅ Scroll overflow detection
  useEffect(() => {
    const checkOverflow = () => {
      const el = categoryNavRef.current;
      if (el) {
        setShowRightIndicator(el.scrollWidth > el.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    categoryNavRef.current?.addEventListener("scroll", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
      categoryNavRef.current?.removeEventListener("scroll", checkOverflow);
    };
  }, [pathname]);

  // ✅ Reset scroll on path change
  useEffect(() => {
    if (categoryNavRef.current) categoryNavRef.current.scrollLeft = 0;
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      {/* 🖤 Top Banner */}
      <div className="w-full bg-black text-white text-center font-bold text-sm py-1 uppercase tracking-wide">
        Free Shipping on All Orders
      </div>

      {/* 🧩 Header */}
      <header className="w-full bg-white border-b border-gray-100 text-gray-900">
        {/* ===== MOBILE HEADER ===== */}
        <div className="flex items-center justify-between md:hidden px-4 py-3">
          <Link href="/" className="flex items-center" aria-label="Go Home">
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
            <button
              type="button"
              aria-label="User Account"
              className="focus:outline-none"
            >
              <User className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
            </button>

            <button
              type="button"
              aria-label="Favorites"
              className="focus:outline-none"
            >
              <Heart className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
            </button>

            {/* ✅ Cart Icon (mobile) */}
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

            <button
              type="button"
              aria-label="Open Menu"
              className="focus:outline-none"
            >
              <Menu className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
            </button>
          </div>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden md:flex flex-col md:flex-row md:items-center md:justify-between px-4 md:px-8 lg:px-12 py-3">
          <Link href="/" className="flex items-center gap-2 mb-3 md:mb-0" aria-label="Go Home">
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
            <button
              type="button"
              aria-label="User Account"
              className="focus:outline-none"
            >
              <User className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
            </button>

            <button
              type="button"
              aria-label="Favorites"
              className="focus:outline-none"
            >
              <Heart className="w-5 h-5 text-gray-700 hover:opacity-100 opacity-70 transition" />
            </button>

            {/* ✅ Cart Icon (desktop) */}
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
  );
}