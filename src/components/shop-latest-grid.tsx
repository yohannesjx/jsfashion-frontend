"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"

export default function ShopLatestGrid() {
  const [products, setProducts] = useState<any[]>([])
  const [visibleCount, setVisibleCount] = useState(40)
  const [selectedImageByProduct, setSelectedImageByProduct] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(process.env.NEXT_PUBLIC_VENDURE_API_URL || "https://jsfashion.et/shop-api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: `
              query ($slug: String!) {
                collection(slug: $slug) {
                  id
                  name
                  slug
                  productVariants(options: { take: 1 }) { totalItems } # anchor to keep response JSON
                  products(options: { take: 100 }) {
                    items {
                      id
                      name
                      slug
                      featuredAsset { preview }
                      variants {
                        id
                        name
                        priceWithTax
                        featuredAsset { preview }
                        options { name value }
                      }
                    }
                  }
                }
              }
            `,
            variables: { slug: "new-arrival" },
          }),
        })

        const json = await res.json()
        if (!cancelled && json?.data?.collection?.products?.items) {
          setProducts(json.data.collection.products.items)
        }
      } catch (err) {
        console.error("❌ Failed to fetch new arrivals:", err)
      }
    })()

    return () => void (cancelled = true)
  }, [])

  function extractColorMap(product: any): { value: string; image?: string }[] {
    const seen = new Set<string>()
    const out: { value: string; image?: string }[] = []
    for (const v of product.variants ?? []) {
      const colorOpt = (v.options || []).find((o: any) => String(o.name || "").toLowerCase() === "color")
      const colorVal = colorOpt?.value?.trim()
      if (colorVal && !seen.has(colorVal.toLowerCase())) {
        seen.add(colorVal.toLowerCase())
        out.push({ value: colorVal, image: v.featuredAsset?.preview })
      }
    }
    return out
  }

  return (
    // Full-width, no unexpected margins that push following content
    <section className="w-full bg-white m-0 p-0">


      {/* Dense 3px gaps, no side padding; do not wrap in a centered container */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-[3px] px-0">
        {products.slice(0, visibleCount).map((p: any) => {
          const colors = extractColorMap(p)
          const img = selectedImageByProduct[p.id] || p.featuredAsset?.preview || ""
          return (
            <Link key={p.id} href={`/products/${p.slug}`} className="block">
              <div className="bg-white overflow-hidden w-full">
                {/* Fixed heights per spec (mobile ~410, desktop a touch taller) */}
                <div className="bg-gray-100 h-[410px] md:h-[440px]">
                  <img
                    src={img}
                    alt={p.name}
                    className="block w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-800 truncate">{p.name}</h3>
                  <p className="text-[#b02a2a] font-semibold text-sm mt-1 text-left leading-tight">
                    {p.variants?.[0]?.priceWithTax
                      ? `${(p.variants[0].priceWithTax / 100).toFixed(2)} Br`
                      : ""}
                  </p>

                  {colors.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {colors.slice(0, 8).map((c) => {
                        const isValidCss =
                          /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(c.value) || /^[a-z]+$/i.test(c.value)
                        const selected = selectedImageByProduct[p.id] === (c.image || "")
                        return (
                          <button
                            key={`${p.id}-${c.value}`}
                            type="button"
                            aria-label={c.value}
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedImageByProduct((prev) => ({
                                ...prev,
                                [p.id]: c.image || prev[p.id] || p.featuredAsset?.preview || "",
                              }))
                            }}
                            className={`w-5 h-5 rounded-full border ${
                              selected ? "border-black scale-105" : "border-gray-300"
                            }`}
                            style={{ backgroundColor: isValidCss ? c.value : "#f5f5f5" }}
                          />
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Load more */}
      {visibleCount < products.length && (
        <div className="px-3 md:px-8 mt-5 mb-0">
          <button
            type="button"
            onClick={() => setVisibleCount((n) => Math.min(n + 20, products.length))}
            className="w-full bg-black text-white py-3 text-sm font-semibold tracking-wide hover:bg-gray-900 transition"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </section>
  )
}