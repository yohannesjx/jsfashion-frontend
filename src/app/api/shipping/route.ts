// src/app/api/shipping/route.ts
/**
 * Fetches eligible shipping methods from Vendure.
 * Supports both GET and POST requests.
 */
async function fetchEligibleShippingMethods(req: Request) {
  try {
    // Forward the user's session cookie
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
            eligibleShippingMethods {
              id
              code
              name
              description
              price
              priceWithTax
            }
          }
        `,
      }),
      credentials: "include",
    });

    const data = await res.json();
    return Response.json(data, { status: 200 });
  } catch (err) {
    console.error("🚚 Shipping fetch error:", err);
    return Response.json(
      { error: "Failed to load shipping methods" },
      { status: 500 }
    );
  }
}

// Handle both GET and POST requests
export async function GET(req: Request) {
  return fetchEligibleShippingMethods(req);
}

export async function POST(req: Request) {
  return fetchEligibleShippingMethods(req);
}