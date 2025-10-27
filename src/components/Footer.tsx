"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Youtube,
  Facebook,
} from "lucide-react"
import { FaTiktok, FaSnapchatGhost, FaPinterestP } from "react-icons/fa"

const sections = [
  {
    title: "GET HELP",
    links: [
      { name: "Customer Service", href: "/help" },
      { name: "Order Tracking", href: "/order-tracking" },
      { name: "Returns", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
  },
  {
    title: "QUICK LINKS",
    links: [
      { name: "Gift Cards", href: "/gift-cards" },
      { name: "Size Guide", href: "/size-guide" },
      { name: "Affiliate Program", href: "/affiliate" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Use", href: "/terms" },
    ],
  },
]

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <footer className="bg-black text-white w-full mt-14">
      {/* === SOCIAL ICONS === */}
      <div className="flex justify-center gap-6 py-6 border-b border-gray-800">
        <Link
          href="https://www.instagram.com"
          target="_blank"
          className="opacity-70 hover:opacity-100 transition"
        >
          <Instagram size={22} />
        </Link>
        <Link
          href="https://www.tiktok.com"
          target="_blank"
          className="opacity-70 hover:opacity-100 transition"
        >
          <FaTiktok size={20} />
        </Link>
        <Link
          href="https://www.youtube.com"
          target="_blank"
          className="opacity-70 hover:opacity-100 transition"
        >
          <Youtube size={22} />
        </Link>
        <Link
          href="https://www.snapchat.com"
          target="_blank"
          className="opacity-70 hover:opacity-100 transition"
        >
          <FaSnapchatGhost size={22} />
        </Link>
        <Link
          href="https://www.facebook.com"
          target="_blank"
          className="opacity-70 hover:opacity-100 transition"
        >
          <Facebook size={22} />
        </Link>
        <Link
          href="https://www.pinterest.com"
          target="_blank"
          className="opacity-70 hover:opacity-100 transition"
        >
          <FaPinterestP size={20} />
        </Link>
      </div>

      {/* === MOBILE VIEW (Collapsible) === */}
      <div className="divide-y divide-gray-800 px-4 md:hidden">
        {sections.map((sec) => (
          <div key={sec.title} className="py-4">
            <button
              className="flex justify-between items-center w-full text-left text-[15px] font-semibold uppercase"
              onClick={() => setOpen(open === sec.title ? null : sec.title)}
            >
              {sec.title}
              {open === sec.title ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>

            {open === sec.title && (
              <ul className="mt-3 space-y-2 pl-1">
                {sec.links.map((l) => (
                  <li key={l.name}>
                    <Link
                      href={l.href}
                      className="text-sm text-gray-300 hover:text-white transition"
                    >
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* === DESKTOP VIEW (4-column expanded layout) === */}
      <div className="hidden md:grid grid-cols-4 gap-8 px-12 py-10 border-b border-gray-800">
        {sections.map((sec) => (
          <div key={sec.title}>
            <h3 className="font-semibold uppercase text-[15px] mb-4">
              {sec.title}
            </h3>
            <ul className="space-y-2">
              {sec.links.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-300 hover:text-white transition"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* === COPYRIGHT === */}
      <div className="text-center text-gray-400 text-xs py-6 border-t border-gray-800">
        © {new Date().getFullYear()} JS Fashion, LLC All Rights Reserved
      </div>
    </footer>
  )
}