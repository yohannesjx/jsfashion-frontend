// src/app/api/shipping/set-method/route.ts

export async function POST(req: Request) {
  try {
    const { shippingMethodId } = await req.json();
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
          mutation SetOrderShippingMethod($id: ID!) {
            setOrderShippingMethod(shippingMethodId: $id) {
              __typename
              ... on Order {
                id
                shippingLines {
                  shippingMethod {
                    name
                  }
                  priceWithTax
                }
              }
              ... on ErrorResult {
                errorCode
                message
              }
            }
          }
        `,
        variables: { id: shippingMethodId },
      }),
      credentials: "include",
    });

    const data = await res.json();
    return Response.json(data);
  } catch (err) {
    console.error("🚨 Error setting shipping method:", err);
    return Response.json({ error: "Failed to set shipping method" }, { status: 500 });
  }
}