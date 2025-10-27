import React from 'react';
import Link from "next/link";

const categories = [
  "Dress",
  "Tops",
  "Bottoms",
  "Bags",
  "Shoes",
  "Accessories",
  "Kids",
  "Matching Sets",
  "Jeans",
  "Jumpsuits",
  "Activewear",
  "Jewlery",
  "GIFT CARD",
  "50% OFF",
  "Maternity",
  "PLUS"
];

const slugify = (name: string) => {
  return name.toLowerCase().replace(/%/g, '').replace(/\s+/g, '-');
};

const NavigationMenu: React.FC = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-200 overflow-x-auto md:overflow-visible">
      <ul className="flex space-x-4 md:space-x-8 px-4 py-2 md:justify-center text-sm md:text-base font-medium whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent md:scrollbar-none">
        {categories.map(category => {
          const slug = slugify(category);
          return (
            <li key={category}>
              <Link
                href={`/collections/${slug}`}
                className="text-gray-800 hover:text-gray-900 hover:underline transition-colors duration-200"
              >
                {category}
              </Link>
            </li>
          );
        })}
      </ul>
      <style>
        {`
          /* Show thin scrollbar on mobile */
          nav::-webkit-scrollbar {
            height: 6px;
          }
          nav::-webkit-scrollbar-track {
            background: transparent;
          }
          nav::-webkit-scrollbar-thumb {
            background-color: rgba(0,0,0,0.2);
            border-radius: 3px;
          }
          /* Hide scrollbar on desktop */
          @media (min-width: 768px) {
            nav::-webkit-scrollbar {
              display: none;
            }
            nav {
              scrollbar-width: none;
              -ms-overflow-style: none;
            }
          }
        `}
      </style>
    </nav>
  );
};

export default NavigationMenu;
