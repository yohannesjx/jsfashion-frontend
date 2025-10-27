import React from "react";
import { vendureQuery } from "@/lib/vendure-client";
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const query = `
    query GetProductBySlug($slug: String!) {
      product(slug: $slug) {
        id
        name
        description
        optionGroups {
          id
          name
          code
          options {
            id
            name
            code
          }
        }
        assets {
          id
          preview
        }
        variants {
          id
          name
          priceWithTax
          options {
            id
            name
            code
          }
          featuredAsset {
            id
            preview
          }
        }
      }
    }
  `;

  let product = null;

  try {
   // const data = await vendureQuery(query, { slug });
  const data: any = await vendureQuery(query, { slug });
   product = data?.product || null;
  } catch (err) {
    console.error("❌ Vendure fetch failed:", err);
  }

  return <ProductClient product={product} />;
}