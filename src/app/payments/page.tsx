"use client";

import React, { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import {
  FlutterWaveButton,
  closePaymentModal,
} from "flutterwave-react-v3";
import type { Id } from "@/convex/_generated/dataModel";

/**
 * Strong type for Flutterwave callback response.
 * Avoids `any` and prevents "excessively deep" Convex expansion.
 */
interface FlutterwaveResponse {
  status?: string;
  tx_ref?: string;
  transaction_id?: number | string;
  amount?: number;
  currency?: string;
  [key: string]: unknown;
}

/**
 * Type for createPayment mutation
 */
interface CreatePaymentArgs {
  txRef: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  response: Record<string, unknown>;
  bidId?: Id<"campaignBids">;
}

export default function PaymentsPage() {
  const { user } = useUser();

  // stable txRef per component instance
  const [txRef] = useState(() => `${Date.now()}`);
  const [amount, setAmount] = useState<number | "">("");

  const createPayment = useMutation(api.payments.createPayment);

  if (!user?.id) {
    return <p className="p-6">Please sign in to make a payment.</p>;
  }

  const numericAmount = Number(amount || 0);
  const isAmountValid =
    Number.isFinite(numericAmount) && numericAmount > 0;

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY ?? "",
    tx_ref: txRef,
    amount: numericAmount,
    currency: "USD",
    payment_options: "card, mobilemoneyzambia, ussd",

    customer: {
      email: user.emailAddresses?.[0]?.emailAddress ?? "",
      name: user.fullName ?? "User",
    },

    /**
     * Flutterwave expects a synchronous function.
     * We strongly type the response and narrow it safely.
     */
    callback: (raw: unknown) => {
      const resp: FlutterwaveResponse =
        typeof raw === "object" && raw !== null ? (raw as FlutterwaveResponse) : {};

      const payload: CreatePaymentArgs = {
        txRef,
        amount: numericAmount,
        currency: "USD",
        paymentMethod: "card",
        response: resp as Record<string, unknown>,
      };

      createPayment(payload)
        .then(() => {
          alert("Payment recorded successfully!");
          setAmount("");
          closePaymentModal();
        })
        .catch((err) => {
          console.error("createPayment error:", err);
          alert("Payment failed — contact support.");
          closePaymentModal();
        });
    },

    onClose: () => {},

    customizations: {
      title: "Cultivate AI",
      description: "Fund your campaign securely",
      logo: "https://yourdomain.com/logo.png",
    },
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">
        Fund Your Campaigns / Investments
      </h1>

      <div className="flex gap-3 items-center">
        <Input
          type="number"
          placeholder="Amount (e.g. 100)"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-40"
        />

        {/* Flutterwave button requires a loose config type.
            We cast once at the boundary, avoiding ANY inside app code. */}
        <FlutterWaveButton
          {...(config as Record<string, unknown>)}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          disabled={!isAmountValid}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        Payments are processed securely via Flutterwave.
      </p>
    </div>
  );
}
