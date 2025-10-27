const VENDURE_API_URL = process.env.NEXT_PUBLIC_VENDURE_API_URL || "https://jsfashion.et/shop-api";

export async function vendureQuery<T>(query: string, variables?: any): Promise<T> {
  try {
    const res = await fetch(`${VENDURE_API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("❌ Vendure API returned non-OK response:", res.status, res.statusText);
      const text = await res.text();
      if (text.startsWith("<!DOCTYPE")) {
        throw new Error("Vendure API returned non-JSON (HTML) response");
      }
      throw new Error(`Vendure API returned ${res.status}: ${res.statusText}`);
    }

    const json = await res.json().catch(() => {
      throw new Error("Vendure API returned invalid JSON response");
    });

    if (json.errors?.length) {
      console.error("❌ Vendure GraphQL errors:", json.errors);
      throw new Error(json.errors[0].message);
    }

    return json.data;
  } catch (err) {
    console.error("[Vendure fetch failed]", err);
    throw err;
  }
}

const PRODUCTS_QUERY = `
  query GetProducts {
    products(options: { take: 20 }, languageCode: EN) {
      items {
        id
        name
        slug
        description
        assets { preview }
        variants { id price name }
      }
    }
  }
`;

export async function getProducts() {
  const data = await vendureQuery<{ products?: any }>(PRODUCTS_QUERY);
  return data?.products?.items ?? [];
}

const PRODUCT_QUERY = `
  query GetProductBySlug($slug: String!) {
    product(slug: $slug, languageCode: EN) {
      id
      name
      description
      assets { preview }
      variants { id name price }
    }
  }
`;

export async function getProductBySlug(slug: string) {
  const data = await vendureQuery<{ product?: any }>(PRODUCT_QUERY, { slug });
  return data?.product ?? null;
}

const COLLECTION_QUERY = `
  query GetCollectionProducts($slug: String!) {
    collection(slug: $slug) {
      id
      name
      slug
      productVariants {
        items {
          id
          name
          price
          product {
            id
            slug
            name
            description
            assets { preview }
          }
        }
      }
    }
  }
`;

export async function getCollectionProducts(slug: string = "electronics") {
  const data = await vendureQuery<{ collection?: any }>(COLLECTION_QUERY, { slug });
  return data?.collection?.productVariants?.items ?? [];
}