// src/app/api/cart/summary/route.ts
/**
 * Returns the current active Vendure order (cart contents)
 */
export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") ?? "";

    const res = await fetch(process.env.NEXT_PUBLIC_VENDURE_SHOP_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "vendure-auth-token": process.env.VENDURE_AUTH_TOKEN!,
        "Cookie": cookie,
      },
      body: JSON.stringify({
        query: `
          query {
            activeOrder {
              id
              code
              totalWithTax
              totalQuantity
              lines {
                id
                quantity
                linePriceWithTax
                productVariant {
                  id
                  name
                  featuredAsset {
                    preview
                  }
                  product {
                    slug
                  }
                }
              }
            }
          }
        `,
      }),
      credentials: "include",
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("🧨 Error fetching cart summary:", err);
    return Response.json({ error: "Failed to fetch cart summary" }, { status: 500 });
  }
}