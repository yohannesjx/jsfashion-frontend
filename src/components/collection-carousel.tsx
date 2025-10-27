"use client"

import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"

export default function ProductCarousel({
  collectionSlug,
  title,
  link,
}: {
  collectionSlug: string
  title: string
  link: string
}) {
  const [items, setItems] = useState<any[]>([])
  const railRef = useRef<HTMLDivElement | null>(null)
  // === New Arrivals State ===
  const [newItems, setNewItems] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(12)

  useEffect(() => {
    let aborted = false
    ;(async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_VENDURE_API_URL || "https://jsfashion.et/shop-api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query ($slug: String!) {
                  collection(slug: $slug) {
                    productVariants(options: { take: 40 }) {
                      items {
                        id
                        name
                        priceWithTax
                        product {
                          id
                          name
                          slug
                          featuredAsset { preview }
                        }
                      }
                    }
                  }
                }
              `,
              variables: { slug: collectionSlug },
            }),
          }
        )

        const { data } = await res.json()
        if (!aborted && data?.collection?.productVariants?.items) {
          setItems(data.collection.productVariants.items)
        }
      } catch (err) {
        console.error("❌ Failed to fetch products:", err)
      }
    })()
    return () => void (aborted = true)
  }, [collectionSlug])

  // === Fetch New Arrivals ===
  useEffect(() => {
    let aborted = false
    ;(async () => {
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_VENDURE_API_URL || "https://jsfashion.et/shop-api",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                query ($slug: String!) {
                  collection(slug: $slug) {
                    productVariants(options: { take: 24 }) {
                      items {
                        id
                        name
                        priceWithTax
                        product {
                          id
                          name
                          slug
                          featuredAsset { preview }
                        }
                      }
                    }
                  }
                }
              `,
              variables: { slug: "new-arrival" },
            }),
          }
        )
        const { data } = await res.json()
        if (!aborted && data?.collection?.productVariants?.items) {
          setNewItems(data.collection.productVariants.items)
        }
      } catch (err) {
        console.error("❌ Failed to fetch new arrivals:", err)
      }
    })()
    return () => void (aborted = true)
  }, [])

  const scrollByCards = (dir: 1 | -1) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLDivElement>("[data-card]")
    const gap = 1 // updated gap between cards to 1px
    const step = card ? card.offsetWidth + gap : 161
    rail.scrollBy({ left: dir * step * 2, behavior: "smooth" })
  }

  return (
    <>
    <section className="bg-white py-6 overflow-hidden max-w-[100vw] px-[3px] md:px-[3px]">
      <div className="flex justify-between items-center px-4 md:px-8 mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">{title}</h2>
        <Link href={link} className="text-sm text-gray-600 hover:text-black font-medium">
          Show more →
        </Link>
      </div>

      <div className="relative">
        {/* Desktop arrows */}
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCards(-1)}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white shadow hover:bg-gray-50"
        >
          ‹
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCards(1)}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 h-9 w-9 items-center justify-center rounded-full border bg-white shadow hover:bg-gray-50"
        >
          ›
        </button>

        {/* Rail wrapper uses negative margins to align with page padding but stays inside viewport */}
        <div
          ref={railRef}
          className="overflow-x-auto scroll-smooth snap-x snap-mandatory hide-scrollbar touch-pan-x overscroll-x-contain min-w-0 px-[3px]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-[1px]">
            {items.slice(0, 12).map((it) => (
              <Link
                key={it.id}
                href={`/products/${it.product.slug}`}
                className="snap-start flex-shrink-0"
              >
                <div
                  data-card
                  className="w-[160px] md:w-[200px] bg-white overflow-hidden"
                >
                  <div className="h-[240px] md:h-[300px] bg-gray-100">
                    <img
                      src={it.product.featuredAsset?.preview || ""}
                      alt={it.product.name}
                      className="w-full h-full object-cover"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-2">
                    <h3 className="text-sm font-medium text-gray-800 truncate">
                      {it.product.name}
                    </h3>
                    <p className="text-[#b02a2a] font-semibold text-sm mt-1 text-left leading-tight">
                      {((it.priceWithTax ?? 0) / 100).toFixed(2)} {process.env.NEXT_PUBLIC_VENDURE_CURRENCY || 'Br'}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* local CSS: hide horizontal scrollbar */}
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
    {/* ===== NEW ARRIVALS ===== */}
    <section className="bg-white mt-6">
      <div className="flex justify-between items-center px-3 md:px-8 mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">SHOP THE LATEST</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[1px] gap-y-[10px] px-0 justify-center">
        {newItems.slice(0, visibleCount).map((it) => (
          <Link key={it.id} href={`/products/${it.product.slug}`}>
            <div
              className="bg-white overflow-hidden w-full"
              style={{
                height: typeof window !== "undefined" && window.innerWidth >= 768 ? "480px" : "410px",
                maxWidth: typeof window !== "undefined" && window.innerWidth >= 768 ? "260px" : "215px"
              }}
            >
              <div
                className="bg-gray-100"
                style={{
                  height: typeof window !== "undefined" && window.innerWidth >= 768 ? "380px" : "320px"
                }}
              >
                <img
                  src={it.product.featuredAsset?.preview || ''}
                  alt={it.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="text-sm font-medium text-gray-800 truncate">{it.product.name}</h3>
                <p className="text-[#b02a2a] font-semibold text-sm mt-1 text-left leading-tight">
                  {((it.priceWithTax ?? 0) / 100).toFixed(2)} {process.env.NEXT_PUBLIC_VENDURE_CURRENCY || 'Br'}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {visibleCount < newItems.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((prev) => Math.min(prev + 12, 40))}
            className="px-8 py-3 bg-black text-white text-sm md:text-base font-medium rounded-none hover:bg-gray-800 transition"
          >
            Load More
          </button>
        </div>
      )}
    </section>
    </>
  )
}