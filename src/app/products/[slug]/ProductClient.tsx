"use client";

import { useCartStore } from "@/store/cart";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import NavigationMenu from "@/components/NavigationMenu";
import { vendureQuery } from "@/lib/vendure-client";
import { ShoppingBag } from "lucide-react";

export default function ProductClient({ product }: { product: any }) {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  // ✅ Zustand hooks for reactivity
  const totalItems = useCartStore((s) => s.totalItems);
  const setIsCartOpen = useCartStore((s) => s.setIsCartOpen);

  useEffect(() => {
  const { setIsCartOpen } = useCartStore.getState();
  setIsCartOpen(false); // ✅ Close the cart when viewing PDP
}, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  // ✅ Detect valid color safely (avoid SSR mismatch)
  const isValidColor = (color: string) => {
    if (typeof window === "undefined") return false;
    const s = document.createElement("option").style;
    s.color = color;
    return s.color !== "";
  };

  // ✅ Variants
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  const colorOptions =
    product.optionGroups?.find(
      (g: any) => g.name?.toLowerCase() === "color"
    )?.options || [];

  const sizeOptions =
    product.optionGroups?.find(
      (g: any) => g.name?.toLowerCase() === "size"
    )?.options || [];

  // ✅ All product images
  const allImages = [
    ...(product.assets?.map((a: any) => a.preview) || []),
    ...(product.variants?.flatMap((v: any) =>
      v.featuredAsset ? [v.featuredAsset.preview] : []
    ) || []),
  ].filter(Boolean);

  const [dynamicImages, setDynamicImages] = useState(allImages);

  const updateImagesForVariant = (variant: any) => {
    if (!variant) return;
    const variantImage = variant.featuredAsset?.preview;
    if (variantImage) {
      const rest = allImages.filter((img) => img !== variantImage);
      setSelectedImage(0);
      setDynamicImages([variantImage, ...rest]);
    } else {
      setDynamicImages(allImages);
    }
  };

  const handleVariantSelect = (optionId: string) => {
    const variant = product.variants?.find((v: any) =>
      v.options?.some((o: any) => o.id === optionId)
    );
    if (variant) {
      setSelectedVariant(variant);
      updateImagesForVariant(variant);
    }
  };

// ✅ Add to Cart handler
const handleAddToCart = () => {
  if (!selectedVariant?.id) return;

  setAdding(true);

  try {
    const { addItem } = useCartStore.getState();

    const item = {
      id: selectedVariant.id,
      name: product.name,
      price: selectedVariant.priceWithTax ?? 0,
      quantity: 1,
      image:
        selectedVariant?.featuredAsset?.preview ||
        product.assets?.[0]?.preview ||
        "",
    };

    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 6000); // reset after 6s
  } catch (err) {
    console.error("🛒 Add to cart failed:", err);
  } finally {
    setAdding(false);
  }
};


  // ✅ Component JSX
  return (
    <>
      {!lightboxOpen && <Header />}
      {!lightboxOpen && <NavigationMenu />}

      {/* ✅ Image Carousel */}
      <div className="relative w-full overflow-x-hidden">
        <div className="flex gap-[3px] snap-x snap-mandatory overflow-x-auto scroll-smooth">
          {dynamicImages.length > 0 ? (
            dynamicImages.map((img: string, idx: number) => (
              <div
                key={idx}
                className="flex-shrink-0 snap-center cursor-pointer"
                style={{ flex: "0 0 80%" }}
                onClick={() => {
                  setSelectedImage(idx);
                  setLightboxOpen(true);
                }}
              >
                <img
                  src={
                    img.startsWith("http")
                      ? img
                      : `https://jsfashion.et${img}`
                  }
                  alt={`Product Image ${idx + 1}`}
                  className="object-cover w-full h-[500px] md:h-[600px]"
                  draggable={false}
                />
              </div>
            ))
          ) : (
            <div className="w-full h-[500px] bg-gray-100 flex items-center justify-center text-gray-500">
              No Images Available
            </div>
          )}
        </div>
      </div>

      {/* ✅ Product Details */}
      {!lightboxOpen && (
        <div className="p-6 md:px-12 max-w-4xl mx-auto text-left">
          <h1 className="text-md font-normal text-gray-800 mb-1 tracking-tight">
            {product.name}
          </h1>

          {selectedVariant?.priceWithTax && (
            <p className="text-2xl font-bold text-gray-900 mb-4">
              {selectedVariant.priceWithTax.toLocaleString()} Br
            </p>
          )}

          {/* 🎨 Color Options */}
          {colorOptions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Color</h4>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
                {colorOptions.map((opt: any) => {
                  const variant = product.variants?.find((v: any) =>
                    v.options?.some((o: any) => o.id === opt.id)
                  );
                  const img = variant?.featuredAsset?.preview;
                  const colorName = opt.name.toLowerCase();
                  const isSelected = selectedVariant?.options?.some(
                    (o: any) => o.id === opt.id
                  );

                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleVariantSelect(opt.id)}
                      className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? "border-black" : "border-gray-300"
                      }`}
                      title={opt.name}
                    >
                      {img ? (
                        <img
                          src={
                            img.startsWith("http")
                              ? img
                              : `https://jsfashion.et${img}`
                          }
                          alt={opt.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : mounted && isValidColor(colorName) ? (
                        <span
                          className="w-7 h-7 rounded-full border border-gray-200"
                          style={{ backgroundColor: colorName }}
                        ></span>
                      ) : (
                        <span className="text-xs text-gray-600">
                          {opt.name}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 📏 Size Options */}
          {sizeOptions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Size</h4>
              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((opt: any) => (
                  <button
                    key={opt.id}
                    onClick={() => handleVariantSelect(opt.id)}
                    className={`px-3 py-1 rounded border text-sm ${
                      selectedVariant?.options?.some((o: any) => o.id === opt.id)
                        ? "bg-black text-white border-black"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {opt.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
            {product.description}
          </p>

          {/* 🛒 Add to Cart + Live Counter */}
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`flex-1 px-6 py-3 rounded font-semibold ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-black text-white hover:bg-gray-900"
              } transition`}
            >
              {added ? "Item In the cart! We'll hold it for 30 minutes" : adding ? "Adding..." : "Add to Cart"}
            </button>

            {/* 🛍️ Reactive Cart Icon */}
            {isClient && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative focus:outline-none border border-gray-200 rounded-full p-3 hover:bg-gray-50 transition"
              >
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}