"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ImageLightboxProps {
  images: string[];
  isOpen: boolean;
  initialIndex: number;
  onClose: () => void;
}

export default function ImageLightbox({
  images,
  isOpen,
  initialIndex,
  onClose,
}: ImageLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const startY = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) setCurrent(initialIndex);
  }, [isOpen, initialIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null) {
      const diff = e.touches[0].clientY - startY.current;
      if (diff > 80) onClose(); // swipe down to close
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        
        <motion.div
  className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col items-center justify-center"
  style={{ touchAction: "none", pointerEvents: "auto" }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
>
  {/* Close button */}
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-white text-3xl font-light z-50"
  >
    ×
  </button>

  {/* Main image with swipe left/right */}
   {/* Main image with swipe left/right */}
{/* Main image with swipe left/right */}
<motion.img
  key={current}
  src={images[current]}
  alt={`Product image ${current + 1}`}
  className="object-contain w-full h-[80vh] select-none"
  drag="x"
  dragConstraints={{ left: 0, right: 0 }}
  dragElastic={0.3}
  onDragEnd={(e, info) => {
    const swipePower = Math.abs(info.offset.x) * info.velocity.x;
    if (swipePower < -500 && current < images.length - 1) {
      setCurrent((prev) => prev + 1);
    } else if (swipePower > 500 && current > 0) {
      setCurrent((prev) => prev - 1);
    }
  }}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0 }}
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
/>

  {/* Thumbnails */}
  <div className="flex overflow-x-auto gap-2 mt-4 px-4 pb-4">
    {images.map((img, idx) => (
      <img
        key={idx}
        src={img}
        onClick={() => setCurrent(idx)}
        className={`w-16 h-16 object-cover rounded ${
          idx === current ? "ring-2 ring-white" : "opacity-60 hover:opacity-100"
        }`}
      />
    ))}
  </div>
</motion.div>
      )}
    </AnimatePresence>
  );
}