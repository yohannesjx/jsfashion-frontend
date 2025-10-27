// src/app/api/shipping/set-address/route.ts

/**
 * Sets the order shipping address in Vendure.
 * Required before eligibleShippingMethods will return any results in Vendure v3.5+.
 */

export async function POST(req: Request) {
  try {
    const { fullName, streetLine1, city, postalCode, countryCode } =
      await req.json();

    // Basic validation
    if (!fullName || !streetLine1 || !city || !countryCode) {
      return Response.json(
        { error: "Missing required shipping address fields" },
        { status: 400 }
      );
    }

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
          mutation SetOrderShippingAddress($input: CreateAddressInput!) {
            setOrderShippingAddress(input: $input) {
              __typename
              ... on Order {
                id
                code
                shippingAddress {
                  fullName
                  city
                  postalCode
                  country
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
          input: { fullName, streetLine1, city, postalCode, countryCode },
        },
      }),
      credentials: "include",
    });

    // ✅ Debug logs for backend inspection
    console.log("Vendure response status:", res.status);
    const text = await res.text();
    console.log("Vendure raw response:", text);

    // Try parsing JSON safely
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      console.error("⚠️ Failed to parse Vendure JSON response");
      return Response.json(
        { error: "Invalid Vendure response", raw: text },
        { status: 502 }
      );
    }

    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("🏠 Error setting shipping address:", err);
    return Response.json(
      { error: "Failed to set shipping address" },
      { status: 500 }
    );
  }
}