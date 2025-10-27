import { vendureQuery } from "@/lib/vendure-client";
import Header from "@/components/Header";
import NavigationMenu from "@/components/NavigationMenu";
import ProductList from "@/components/ProductList";

export default async function CollectionPage({ params }: { params: { slug: string } }) {
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
    const data = await vendureQuery(query, { slug: params.slug });
    console.log("🔍 Vendure collection data:", JSON.stringify(data, null, 2));
    collection = data?.collections?.items?.[0] || null;

    // Fallback: if no collection found, fetch all collections
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
      const fallbackData = await vendureQuery(fallbackQuery);
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