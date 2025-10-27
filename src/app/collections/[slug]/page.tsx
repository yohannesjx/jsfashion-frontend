import { vendureQuery } from "@/lib/vendure-client";
import Header from "@/components/Header";
import NavigationMenu from "@/components/NavigationMenu";
import ProductList from "@/components/ProductList";


// ✅ Fix: Next.js 15 passes `params` as a Promise, so we await it
export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = `
    query ($slug: String!) {
      collections(options: { filter: { slug: { eq: $slug } } }) {
        items {
          id
          name
          slug
          productVariants {
            items {
              id
              name
              priceWithTax
              product {
                id
                name
                slug
                featuredAsset {
                  preview
                }
              }
            }
          }
        }
      }
    }
  `;

  let collection = null;
  try {
    //const data = await vendureQuery(query, { slug });
    const data: any = await vendureQuery(query, { slug });
    console.log("🔍 Vendure collection data:", JSON.stringify(data, null, 2));
    collection = data?.collections?.items?.[0] || null;

    // ✅ Fallback: fetch all collections if slug not found
    if (!collection) {
      console.warn("⚠️ No collection found by slug, fetching all collections as fallback...");
      const fallbackQuery = `
        query {
          collections {
            items {
              id
              name
              slug
              productVariants {
                items {
                  id
                  name
                  priceWithTax
                  product {
                    id
                    name
                    slug
                    featuredAsset {
                      preview
                    }
                  }
                }
              }
            }
          }
        }
      `;
      const fallbackData: any = await vendureQuery(fallbackQuery);
      console.log("🪄 Fallback collections:", JSON.stringify(fallbackData, null, 2));
      collection = fallbackData?.collections?.items?.[0] || null;
    }
  } catch (err) {
    console.error("❌ Failed to fetch collection:", err);
  }

  if (!collection) {
    return (
      <>
        <Header />
        <NavigationMenu />
        <div className="p-8 text-center text-gray-600">
          <h1 className="text-xl font-semibold">Collection not found</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <NavigationMenu />
      <div className="py-8 max-w-[1280px] mx-auto">
        <h1 className="text-2xl font-bold mb-6">{collection.name}</h1>
        <ProductList products={collection.productVariants.items} />
      </div>
    </>
  );
}