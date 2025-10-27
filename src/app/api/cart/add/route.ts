// src/app/api/cart/add/route.ts

/**
 * Handles adding items to a Vendure order (cart).
 * Creates or updates a Vendure session automatically.
 */


// src/app/api/cart/add/route.ts
export async function POST(req: Request) {
  try {
    const { productVariantId, quantity } = await req.json();

    const res = await fetch(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `
          mutation AddItem($variantId: ID!, $qty: Int!) {
            addItemToOrder(productVariantId: $variantId, quantity: $qty) {
              __typename
              ... on Order {
                id
                code
                state
                totalWithTax
                totalQuantity
                lines {
                  id
                  quantity
                  linePriceWithTax
                  productVariant {
                    id
                    name
                    featuredAsset { preview }
                    product { slug }
                  }
                }
              }
              ... on ErrorResult {
                errorCode
                message
              }
            }
          }
        `,
        variables: {
          variantId: productVariantId,
          qty: quantity,
        },
      }),
      credentials: "include",
    });

    const vendureCookie = res.headers.get("set-cookie");
    const data = await res.json();

    // ✅ forward Vendure session to browser
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (vendureCookie) headers["Set-Cookie"] = vendureCookie;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers,
    });
  } catch (err) {
    console.error("🧨 Error adding item:", err);
    return Response.json({ error: "Failed to add item" }, { status: 500 });
  }
}