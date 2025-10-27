"use client";

import React, { useState } from "react";
import Link from "next/link";

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

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <div className="px-0">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[1px] gap-y-[10px]">
        {visibleProducts.map((variant) => (
          <Link
            key={variant.id}
            href={`/products/${variant.product.slug}`}
            className="bg-white overflow-hidden block"
          >
            <img
              src={variant.product.featuredAsset?.preview || "/placeholder.png"}
              alt={variant.product.name}
              className="w-full h-[280px] object-cover"
              loading="lazy"
            />
            <div className="p-2">
              <h2 className="text-xs font-normal truncate text-gray-700">
                {variant.product.name}
              </h2>
              <p className="text-black text-base font-semibold">
                {variant.priceWithTax.toLocaleString()} Br
              </p>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < products.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setVisibleCount((c) => c + 20)}
            className="bg-black text-white text-sm px-8 py-3 rounded-none"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}