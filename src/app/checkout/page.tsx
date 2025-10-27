"use client";

import { useState } from "react";

export default function CheckoutPage() {
  const [address, setAddress] = useState({
    fullName: "",
    streetLine1: "",
    city: "",
    postalCode: "",
    countryCode: "ET",
    saveForNextTime: true, // ✅ default checked
  });

  const [shippingMethods, setShippingMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🏠 Save shipping address & load eligible shipping methods
  async function handleSetAddress() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/shipping/set-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(address),
      });
      const data = await res.json();
      console.log("📦 Address saved:", data);

      if (data?.data?.setOrderShippingAddress?.__typename === "Order") {
        setMessage("Shipping address saved!");
        await fetchShippingMethods();
      } else {
        setMessage("Please add an item to your cart first.");
      }
    } catch (err) {
      console.error("Error saving address:", err);
      setMessage("Error saving address.");
    } finally {
      setLoading(false);
    }
  }

  // 🚚 Fetch eligible shipping methods
  async function fetchShippingMethods() {
    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      console.log("🚚 Shipping methods:", data);
      setShippingMethods(data?.data?.eligibleShippingMethods ?? []);
    } catch (err) {
      console.error("Error fetching shipping methods:", err);
    }
  }

  // 🚀 Set shipping method in Vendure
  async function handleSelectShipping(methodId: string) {
    setSelectedMethod(methodId);
    try {
      const res = await fetch("/api/shipping/set-method", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingMethodId: methodId }),
      });
      const data = await res.json();
      console.log("✅ Shipping method set:", data);
      setMessage("Shipping method selected!");
    } catch (err) {
      console.error("Error setting shipping method:", err);
      setMessage("Failed to set shipping method.");
    }
  }

  // 💳 Payment options
  const paymentOptions = [
    { id: "chappa", name: "Chappa (ETB)" }, // ✅ new payment gateway
    { id: "cod", name: "Cash on Delivery" },
  ];

  // 🧾 Place order (Chappa or COD)
  async function handlePlaceOrder() {
    if (!selectedMethod || !selectedPayment) {
      setMessage("Please select a shipping and payment method first.");
      return;
    }

    if (selectedPayment === "chappa") {
  try {
    console.log("💳 Initializing Chappa payment...");
    const res = await fetch("/api/payment/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderCode: "TEMP1234",
        amount: "500",
        // ✅ Use a real email (required by Chappa)
        email: "testuser@jsfashion.et", 
        firstName: address.fullName?.split(" ")[0] || address.fullName || "Customer",
        lastName: address.fullName?.split(" ")[1] || "User",
        phone: "0912345678",
      }),
    });

        const text = await res.text();
        console.log("💳 Raw /api/payment/initialize response:", text);

        const data = JSON.parse(text);
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        } else {
          console.error("Chappa failed:", data);
          setMessage("Payment initialization failed.");
        }
      } catch (err) {
        console.error("Payment error:", err);
        setMessage("Payment initialization failed.");
      }

      return;
    }

    // fallback for other payment types (e.g., COD)
    alert("✅ Order placed successfully (COD)");
  }

  return (
    <main className="max-w-3xl mx-auto px-4 pb-32 pt-6 space-y-8">
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      {/* 🏠 ADDRESS FORM */}
      <section className="bg-white shadow rounded-lg p-4 space-y-3">
        <h2 className="text-lg font-medium border-b pb-2">Shipping Address</h2>
        <input
          className="w-full border p-2 rounded"
          placeholder="Full Name"
          value={address.fullName}
          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Street Address"
          value={address.streetLine1}
          onChange={(e) =>
            setAddress({ ...address, streetLine1: e.target.value })
          }
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="City"
          value={address.city}
          onChange={(e) => setAddress({ ...address, city: e.target.value })}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Postal Code"
          value={address.postalCode}
          onChange={(e) =>
            setAddress({ ...address, postalCode: e.target.value })
          }
        />

        <label className="flex items-center gap-2 text-sm mt-1">
          <input
            type="checkbox"
            checked={address.saveForNextTime}
            onChange={(e) =>
              setAddress({ ...address, saveForNextTime: e.target.checked })
            }
          />
          Save this address for next time
        </label>

        <button
          onClick={handleSetAddress}
          disabled={loading}
          className="bg-black text-white w-full py-3 rounded-md mt-2 font-semibold"
        >
          {loading ? "Saving..." : "Save Shipping Address"}
        </button>
      </section>

      {/* 🚚 SHIPPING METHODS */}
      {shippingMethods.length > 0 && (
        <section className="bg-white shadow rounded-lg p-4 space-y-2">
          <h2 className="text-lg font-medium border-b pb-2">
            Shipping Method
          </h2>
          {shippingMethods.map((m: any) => (
            <label
              key={m.id}
              className={`block border p-3 rounded cursor-pointer ${
                selectedMethod === m.id
                  ? "border-black bg-gray-50"
                  : "border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="shipping"
                className="mr-2"
                checked={selectedMethod === m.id}
                onChange={() => handleSelectShipping(m.id)}
              />
              {m.name} — {(m.priceWithTax / 100).toFixed(2)} ETB
            </label>
          ))}
        </section>
      )}

      {/* 💳 PAYMENT METHODS */}
      <section className="bg-white shadow rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-medium border-b pb-2">Payment Method</h2>
        {paymentOptions.map((option) => (
          <label
            key={option.id}
            className={`block border p-3 rounded cursor-pointer ${
              selectedPayment === option.id
                ? "border-black bg-gray-50"
                : "border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="payment"
              className="mr-2"
              checked={selectedPayment === option.id}
              onChange={() => setSelectedPayment(option.id)}
            />
            {option.name}
          </label>
        ))}
      </section>

      {/* 🧾 Sticky Place Order Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <p className="font-semibold text-gray-800">
            Ready to confirm your order?
          </p>
          <button
            onClick={handlePlaceOrder}
            className="bg-black text-white px-6 py-3 rounded-lg font-semibold"
          >
            Place Order
          </button>
        </div>
      </div>

      {/* 🧠 STATUS MESSAGE */}
      {message && (
        <p className="text-sm text-center text-gray-700 bg-gray-100 py-2 rounded">
          {message}
        </p>
      )}
    </main>
  );
}