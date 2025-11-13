"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FlutterWaveButton, closePaymentModal } from "flutterwave-react-v3";

export default function PaymentsPage() {
  const { user } = useUser();
  const userId = user?.id ?? "";
  const [amount, setAmount] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const createPayment = useMutation(api.payments.createPayment);

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY!,
    tx_ref: `${Date.now()}`,
    amount: amount,
    currency: "USD",
    payment_options: "card, mobilemoneyghana, ussd",
    customer: {
      email: user?.emailAddresses[0].emailAddress,
      name: user?.fullName,
    },
    callback: async (response: any) => {
      await createPayment({
        userId,
        method: "card",
        amount: Number(amount),
        details: response,
      });
      alert("Payment successful!");
      setAmount("");
      closePaymentModal();
    },
    onClose: () => {},
  };

  if (!userId) return <p className="p-6">Please sign in to make a payment.</p>;

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Fund Your Campaigns / Investments</h1>

      <div className="flex gap-3">
        <Input
          type="number"
          placeholder="Amount (e.g., 100)"
          value={amount}
          onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
        />
        <FlutterWaveButton {...config} className="px-4 py-2 bg-blue-600 text-white rounded" />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Payments are processed securely via Flutterwave.
      </p>
    </div>
  );
}
