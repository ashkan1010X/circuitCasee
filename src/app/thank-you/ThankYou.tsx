"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { getPaymentStatus } from "./action";
import { Loader2 } from "lucide-react";

export default function ThankYou() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["get-payment-status", orderId],
    queryFn: async () => await getPaymentStatus({ orderId }),
    retry: true,
    retryDelay: 1000,
    enabled: !!orderId,
  });

  // TRUE loading state (actual request in progress)
  if (isLoading) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">Verifying your payment...</h3>
          <p>This might take a moment.</p>
        </div>
      </div>
    );
  }

  // Payment exists but not completed yet (your backend returns false)
  if (data === false) {
    return (
      <div className="w-full mt-24 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <h3 className="font-semibold text-xl">
            Payment is still processing...
          </h3>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  // Paid success state
  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <h3 className="font-semibold text-xl">Payment successful 🎉</h3>
        <p>Your order has been confirmed.</p>
      </div>
    </div>
  );
}
