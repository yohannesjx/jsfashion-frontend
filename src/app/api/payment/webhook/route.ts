// src/app/api/payment/webhook/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log("📩 Chappa Webhook Received:", payload);

    const txRef = payload?.data?.tx_ref;
    const status = payload?.data?.status;

    if (!txRef) {
      return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });
    }

    // ✅ Only process successful payments
    if (status === "success") {
      // Find Vendure order by code or tx_ref
      // (Assuming you stored txRef as `jsfashion-<orderCode>-<timestamp>`)

      const orderCode = txRef.split("-")[1]; // extract order code
      const vendureShopApi = process.env.NEXT_PUBLIC_VENDURE_API_URL || "https://jsfashion.et/shop-api";

      // Transition order → ArrangingPayment
      await fetch(vendureShopApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              transitionOrderToState(state: "ArrangingPayment") {
                __typename
              }
            }
          `,
        }),
      });

      // Add payment record
      await fetch(vendureShopApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              addPaymentToOrder(
                input: {
                  method: "chappa",
                  metadata: {
                    tx_ref: "${txRef}",
                    raw: "${JSON.stringify(payload).replace(/"/g, '\\"')}"
                  }
                }
              ) {
                __typename
              }
            }
          `,
        }),
      });

      // Mark order as paid
      await fetch(vendureShopApi, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              transitionOrderToState(state: "PaymentSettled") {
                __typename
              }
            }
          `,
        }),
      });

      console.log(`✅ Order ${orderCode} marked as paid!`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("💥 Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}