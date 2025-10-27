// src/app/api/payment/initialize/route.ts

export async function POST(req: Request) {
  try {
    const { orderCode, amount, email, firstName, lastName, phone } = await req.json();

    // ✅ Validate required fields
    if (!email || !amount) {
      return Response.json(
        {
          error: "Missing required fields",
          details: {
            required: ["email", "amount"],
            received: { email, amount },
          },
        },
        { status: 400 }
      );
    }

    // If no orderCode is passed, use fallback to current Vendure activeOrder
    let code = orderCode;
    let totalAmount = amount;

    if (!orderCode || !amount) {
      try {
        const vendureRes = await fetch(
          `${process.env.NEXT_PUBLIC_VENDURE_API_URL || "https://jsfashion.et/shop-api"}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                {
                  activeOrder {
                    code
                    totalWithTax
                  }
                }
              `,
            }),
          }
        );

        const vendureData = await vendureRes.json();
        console.log("🛒 Vendure activeOrder:", vendureData);

        if (vendureData?.data?.activeOrder) {
          code = vendureData.data.activeOrder.code;
          totalAmount = (vendureData.data.activeOrder.totalWithTax / 100).toFixed(2);
        }
      } catch (vendureErr) {
        console.warn("⚠️ Could not fetch activeOrder from Vendure:", vendureErr);
      }
    }

    // ✅ Transaction reference
    const txRef = `jsfashion-${code || "order"}-${Date.now()}`;

    // ✅ Build payload for Chappa
    const payload = {
      amount: totalAmount,
      currency: "ETB",
      email,
      first_name: firstName || "Customer",
      last_name: lastName || "User",
      phone_number: phone || "0912345678",
      tx_ref: txRef,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/webhook`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
      "customization[title]": "JSFashion Payment",
      "customization[description]": "Order payment on JSFashion via Chappa",
    };

    console.log("📦 Chappa Init Payload:", payload);

    // ✅ Send to Chappa
    const chapaRes = await fetch(`${process.env.CHAPPA_BASE_URL || "https://api.chapa.co/v1"}/transaction/initialize`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CHAPPA_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    // ✅ Parse response safely
    const data = await chapaRes.json().catch(async () => {
      const text = await chapaRes.text();
      console.error("⚠️ Non-JSON Chappa response:", text);
      return { status: "failed", message: "Invalid JSON response", raw: text };
    });

    console.log("💳 Chappa Init Response:", data);

    // ✅ Handle failure
    if (!chapaRes.ok || data.status !== "success" || !data?.data?.checkout_url) {
      return Response.json(
        {
          error: "Chappa initialization failed",
          details: data,
        },
        { status: 400 }
      );
    }

    // ✅ Return checkout link to frontend
    return Response.json({
      checkoutUrl: data.data.checkout_url,
      txRef,
      amount: totalAmount,
      orderCode: code,
    });
  } catch (err) {
    console.error("💥 Error initializing Chappa payment:", err);
    return Response.json(
      { error: "Payment initialization failed", message: String(err) },
      { status: 500 }
    );
  }
}