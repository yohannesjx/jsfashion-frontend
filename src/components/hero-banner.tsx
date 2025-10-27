"use client"

import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

interface Banner {
  id: number
  image: string
  mobileImage: string
  alt: string
  link?: string
}

const banners: Banner[] = [
  {
    id: 1,
    image: "/banners/hero1-desktop.jpg",
    mobileImage: "/banners/hero1-mobile.jpg",
    alt: "New arrivals",
  },
  {
    id: 2,
    image: "/banners/discount-desktop.jpg",
    mobileImage: "/banners/discount-mobile.jpg",
    alt: "Shop 30% off",
  },
  {
    id: 3,
    image: "/banners/collection-desktop.jpg",
    mobileImage: "/banners/collection-mobile.jpg",
    alt: "Summer collection",
  },
]

export default function HeroBanner() {
  const [index, setIndex] = useState(0)
  const current = banners[index]

  useEffect(() => {
    console.log("🎬 HeroBanner mounted")
    console.log("🔢 Banner count:", banners.length)

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, 5000)

    return () => {
      clearInterval(interval)
      console.log("🛑 HeroBanner unmounted")
    }
  }, [])

  useEffect(() => {
    console.log("🖼️ Showing banner:", current.image)
  }, [index])

  return (
    <div className="relative w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="w-full"
        >
          <Image
            src={current.image}
            alt={current.alt}
            width={1920}
            height={800}
            className="hidden md:block w-full h-auto object-cover"
            priority
          />
          <Image
            src={current.mobileImage}
            alt={current.alt}
            width={800}
            height={1000}
            className="block md:hidden w-full h-auto object-cover"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Dots navigation */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((b, i) => (
          <button
            key={b.id}
            onClick={() => setIndex(i)}
            className={`h-2 w-2 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  )
}