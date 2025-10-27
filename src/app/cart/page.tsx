"use client";

import { useCartStore } from "@/store/cart";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { items, total, removeItem } = useCartStore();
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipeDistance, setSwipeDistance] = useState<{ [key: string]: number }>({});
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [delivery, setDelivery] = useState(0);

  // 🧩 Add item or update Vendure cart backend
  async function addToVendureCart(productVariantId: number, quantity: number = 1) {
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productVariantId, quantity }),
      });

      const json = await res.json();
      const order = json?.data?.addItemToOrder;

      if (order?.__typename === "Order") {
        // Sync local store with Vendure order lines
        useCartStore.setState({
          items: order.lines.map((line: any) => ({
            id: line.productVariant.id,
            name: line.productVariant.name,
            quantity: line.quantity,
            price: line.linePriceWithTax / line.quantity / 100,
            image: line.productVariant.product?.featuredAsset?.preview || "",
          })),
          total: order.totalWithTax / 100,
        });
      } else {
        console.error("❌ Vendure cart update failed:", order);
      }
    } catch (err) {
      console.error("🧨 Error adding to Vendure cart:", err);
    }
  }

  // 🖐️ Swipe logic
  const handleTouchStart = (id: string, e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (id: string, e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const distance = touchStartX - e.touches[0].clientX;
    setSwipeDistance((prev) => ({
      ...prev,
      [id]: Math.max(0, Math.min(distance, 120)),
    }));
  };

  const handleTouchEnd = (id: string) => {
    const distance = swipeDistance[id] || 0;
    if (distance > 80) removeItem(id);
    setSwipeDistance((prev) => ({ ...prev, [id]: 0 }));
    setTouchStartX(null);
  };

  // 🧮 Update quantity locally + Vendure sync
  const updateQuantity = async (id: string, delta: number) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(0, item.quantity + delta);

    if (newQty === 0) {
      removeItem(id);
    } else {
      // Local instant update
      useCartStore.setState((state) => ({
        items: state.items.map((i) =>
          i.id === id ? { ...i, quantity: newQty } : i
        ),
        total: state.items.reduce(
          (acc, i) =>
            acc +
            (i.id === id ? i.price * newQty : i.price * i.quantity),
          0
        ),
      }));

      // Sync with Vendure
      await addToVendureCart(Number(id), newQty);
    }
  };

  // 🧾 Fetch shipping methods from your /api/shipping route
  useEffect(() => {
    async function fetchDelivery() {
      try {
        const res = await fetch("/api/shipping", {
          method: "POST",
          credentials: "include",
        });
        const json = await res.json();
        const price =
          json?.data?.eligibleShippingMethods?.[0]?.priceWithTax ?? 0;
        setDelivery(price / 100);
      } catch (err) {
        console.error("🚚 Delivery fetch failed:", err);
      }
    }
    fetchDelivery();
  }, [items]);

  const subtotal = total;
  const grandTotal = subtotal + delivery - discount;

  return (
    <main className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-semibold text-gray-900">Shopping Bag</h1>
          <Link href="/" className="text-sm text-gray-600 hover:text-black">
            Continue Shopping →
          </Link>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-6 space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-center mt-20 text-lg">
            Your bag is empty.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              {items.length} item{items.length > 1 && "s"} selected
            </p>

            {/* 🛒 Product Cards */}
            {items.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-2xl"
                onTouchStart={(e) => handleTouchStart(item.id, e)}
                onTouchMove={(e) => handleTouchMove(item.id, e)}
                onTouchEnd={() => handleTouchEnd(item.id)}
              >
                <div
                  className="absolute top-0 right-0 h-full w-full bg-red-500 flex items-center justify-end pr-6"
                  style={{
                    opacity: Math.min((swipeDistance[item.id] || 0) / 100, 1),
                    transition: "opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  <Trash2 size={22} className="text-white opacity-80" />
                </div>

                <div
                  className="relative z-10 bg-white shadow-sm flex items-center p-4 gap-4 rounded-2xl"
                  style={{
                    transform: `translateX(-${swipeDistance[item.id] || 0}px)`,
                    transition: touchStartX
                      ? "none"
                      : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                >
                  {/* Image */}
                  <div className="w-24 h-28 relative flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={
                        item.image?.startsWith("http")
                          ? item.image
                          : `https://jsfashion.et${item.image}`
                      }
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-900 leading-tight">
                      {item.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      Size: <span className="font-medium">M</span>
                    </p>

                    {/* Quantity + price */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center 
                                     text-gray-700 hover:bg-gray-800 hover:text-white active:scale-90 
                                     transition-all duration-200 ease-in-out"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} strokeWidth={2} />
                        </button>

                        <span className="text-gray-900 text-sm font-semibold w-6 text-center select-none">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center 
                                     text-gray-700 hover:bg-gray-800 hover:text-white active:scale-90 
                                     transition-all duration-200 ease-in-out"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} strokeWidth={2} />
                        </button>
                      </div>

                      <p className="text-base font-semibold text-gray-900 tracking-tight">
                        {(item.price * item.quantity).toLocaleString()} Br
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center 
                               bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* 🧾 Summary */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-5 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={async () => {
                    try {
                      const res = await fetch("https://jsfashion.et/shop-api", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          query: `
                            mutation ApplyCoupon($couponCode: String!) {
                              applyCouponCode(couponCode: $couponCode) {
                                ... on Order {
                                  id
                                  totalWithTax
                                  discounts {
                                    amountWithTax
                                  }
                                }
                                ... on ErrorResult {
                                  errorCode
                                  message
                                }
                              }
                            }
                          `,
                          variables: { couponCode: promoCode },
                        }),
                      });
                      const json = await res.json();
                      const appliedDiscount =
                        json?.data?.applyCouponCode?.discounts?.[0]?.amountWithTax ?? 0;
                      setDiscount(appliedDiscount / 100);
                    } catch (err) {
                      console.error("❌ Promo code failed:", err);
                    }
                  }}
                  className="bg-black text-white px-6 py-3 rounded-lg text-sm font-medium"
                >
                  Apply
                </button>
              </div>

              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{subtotal.toLocaleString()} Br</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span>-{discount.toLocaleString()} Br</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span>Delivery fee</span>
                  <span>{delivery.toLocaleString()} Br</span>
                </div>
                <div className="flex justify-between font-semibold text-base pt-2">
                  <span>Grand Total</span>
                  <span>{grandTotal.toLocaleString()} Br</span>
                </div>
              </div>

              {/* ✅ Sticky Checkout Button */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
                {items.length > 0 ? (
                  <Link
                    href="/checkout"
                    className="block w-full text-center py-4 bg-black text-white rounded-full font-semibold tracking-wide hover:bg-gray-800 transition-all duration-200"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 rounded-full bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    Proceed to Checkout
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}