"use client"

import Image from "next/image"
import CollectionCarousel from "@/components/collection-carousel"
import Footer from "@/components/Footer"
import ShopLatestGrid from "@/components/shop-latest-grid"
import Header from "@/components/Header"
import NavigationMenu from "@/components/NavigationMenu"

export default function HomeClient() {
  return (
    <main className="flex flex-col items-center w-full bg-white text-gray-800">
      <Header />
      <NavigationMenu />
      {/* ===== PROMO 1 (Top Pink Banner) ===== */}
      <section className="relative w-full">
        <Image
          src="/banners/promo1_desktop.jpg"
          alt="Promo 1 desktop"
          width={1920}
          height={800}
          className="hidden md:block w-full object-cover"
          priority
        />
        <Image
          src="/banners/promo1.jpg"
          alt="Promo 1 mobile"
          width={800}
          height={1000}
          className="md:hidden w-full object-cover"
          priority
        />
      </section>

      {/* ===== HERO BANNER ===== */}
      <section className="relative w-full">
        <Image
          src="/banners/hero1-desktop.jpg"
          alt="Main hero desktop"
          width={1920}
          height={800}
          className="hidden md:block w-full object-cover"
        />
        <Image
          src="/banners/hero1-mobile.jpg"
          alt="Main hero mobile"
          width={800}
          height={1000}
          className="md:hidden w-full object-cover"
        />
      </section>

      {/* ===== PROMO 2 (Below Hero) ===== */}
      <section className="relative w-full">
        <Image
          src="/banners/promo2_desktop.jpg"
          alt="Promo 2 desktop"
          width={1920}
          height={800}
          className="hidden md:block w-full object-cover"
        />
        <Image
          src="/banners/promo2.jpg"
          alt="Promo 2 mobile"
          width={800}
          height={1000}
          className="md:hidden w-full object-cover"
        />
      </section>

      {/* ===== COLLECTION CAROUSEL ===== */}
      <CollectionCarousel
        collectionSlug="50-off"
        title="80% OFF BLOWOUT!"
        link="/collections/50-off"
      />

      {/* ===== HERO 2 BANNER ===== */}
      <section className="w-full mt-6 md:mt-10 flex flex-col items-center">
        <div className="w-full">
          <div className="block md:hidden">
            <img
              src="/banners/hero2-mobile.jpg"
              alt="Hero Banner 2"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="hidden md:block">
            <img
              src="/banners/hero2-desktop.jpg"
              alt="Hero Banner 2"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== SHOP LATEST GRID ===== */}
      <section className="w-full mt-6 md:mt-10 flex flex-col items-center">
        <ShopLatestGrid />
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </main>
  )
}