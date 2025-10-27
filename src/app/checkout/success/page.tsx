import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <main className="max-w-2xl mx-auto text-center py-20">
      <h1 className="text-3xl font-semibold mb-4 text-green-600">
        🎉 Payment Successful!
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! Your payment has been confirmed, and your
        order is being processed.
      </p>
      <Link
        href="/"
        className="bg-black text-white px-6 py-3 rounded-lg font-semibold"
      >
        Continue Shopping
      </Link>
    </main>
  );
}