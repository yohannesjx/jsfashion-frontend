"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProductVariant {
  id: string;
  name: string;
  priceWithTax: number;
  product: {
    id: string;
    name: string;
    slug: string;
    featuredAsset?: { preview?: string };
  };
}

interface ProductListProps {
  products: ProductVariant[];
}

export default function ProductList({ products }: ProductListProps) {
  const [visibleCount, setVisibleCount] = useState(40);

  if (!products || products.length === 0) {
    return (
      <div className="text-center text-gray-600 py-10">
        No products found in this collection.
      </div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="px-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[1px] gap-y-[10px]">
        {visibleProducts.map((variant) => {
          const { product } = variant;
          const imageUrl = product.featuredAsset?.preview || "/placeholder.png";

          return (
            <Link
              key={variant.id}
              href={`/products/${product.slug}`}
              className="bg-white overflow-hidden block group"
              aria-label={`View details for ${product.name}`}
            >
              {/* ✅ Use Next.js Image for optimization */}
              <div className="relative w-full h-[280px]">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-2">
                <h2
                  title={product.name}
                  className="text-xs font-normal truncate text-gray-700"
                >
                  {product.name}
                </h2>
                <p className="text-black text-base font-semibold">
                  {variant.priceWithTax.toLocaleString()} Br
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* ✅ Load more button */}
      {visibleCount < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="bg-black hover:bg-gray-800 transition text-white text-sm px-8 py-3 rounded-none"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}