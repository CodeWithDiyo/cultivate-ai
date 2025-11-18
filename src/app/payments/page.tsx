"use client";

import React, { JSX, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

/**
 * Narrow Flutterwave response shape we care about.
 */
type FlutterwaveResponse = {
  status?: string;
  tx_ref?: string;
  transaction_id?: string | number;
  [k: string]: unknown;
};

/**
 * Payload sent to server /api/payments
 */
type CreatePaymentPayload = {
  txRef?: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  response?: Record<string, unknown>;
};

export default function PaymentsPage(): JSX.Element {
  const { user } = useUser();

  // stable txRef generated once per mount
  const [txRef] = useState(() => `${Date.now()}`);

  const [amount, setAmount] = useState<number | "">("");

  if (!user?.id) {
    return <p className="p-6">Please sign in to make a payment.</p>;
  }

  const numericAmount = Number(amount || 0);
  const isAmountValid = Number.isFinite(numericAmount) && numericAmount > 0;

  const public_key = process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY ?? "";
  const currency = "USD";
  const payment_options = "card, mobilemoneyzambia, ussd";

  // Ensure the customer object matches expected props exactly
  const customer = {
    email: user.emailAddresses?.[0]?.emailAddress ?? "",
    name: user.fullName ?? "User",
    phone_number:
      // clerk may store phone in differing places; fallback to empty string
      (Array.isArray((user as unknown as { phoneNumbers?: { phoneNumber?: string }[] }).phoneNumbers) &&
        ((user as unknown as { phoneNumbers?: { phoneNumber?: string }[] }).phoneNumbers?.[0]?.phoneNumber ??
          "")) ||
      "",
  };

  // Synchronous callback expected by Flutterwave widget
  const onFlutterwaveCallback = (raw: unknown): void => {
    const resp = (typeof raw === "object" && raw !== null ? (raw as FlutterwaveResponse) : {}) as Record<
      string,
      unknown
    >;

    const payload: CreatePaymentPayload = {
      txRef,
      amount: numericAmount,
      currency,
      paymentMethod: "card",
      response: resp,
    };

    // Call your Next.js server endpoint which will call Convex mutation server-side.
    // Keep the client-side code fully typed and avoid using Convex client types here.
    void (async () => {
      try {
        const res = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text();
          console.error("Server payment error:", res.status, txt);
          alert("Payment recorded failed — contact support.");
          closePaymentModal();
          return;
        }

        alert("Payment recorded successfully!");
        setAmount("");
        closePaymentModal();
      } catch (err) {
        console.error("Network error while recording payment:", err);
        alert("Network error — please try again.");
        closePaymentModal();
      }
    })();
  };

  const onFlutterwaveClose = (): void => {
    // optional UX hook when the payment modal is closed
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Fund Your Campaigns / Investments</h1>

      <div className="flex gap-3 items-center">
        <Input
          type="number"
          placeholder="Amount (e.g., 100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
          className="w-40"
        />

        <FlutterWaveButton
          public_key={public_key}
          tx_ref={txRef}
          amount={numericAmount}
          currency={currency}
          payment_options={payment_options}
          customer={customer}
          callback={onFlutterwaveCallback}
          onClose={onFlutterwaveClose}
          customizations={{
            title: "Cultivate AI",
            description: "Fund your campaign securely",
            logo: "https://yourdomain.com/logo.png",
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!isAmountValid}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">Payments are processed securely via Flutterwave.</p>
    </div>
  );
}
