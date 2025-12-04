"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const orderId = searchParams.get("orderId");
  const paymentKey = searchParams.get("paymentKey");
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user || !orderId || !paymentKey) {
      if (!orderId || !paymentKey) {
        setError("결제 정보가 올바르지 않습니다.");
        setProcessing(false);
      }
      return;
    }

    const confirmPayment = async () => {
      try {
        setProcessing(true);
        setError(null);

        // 주문 상태를 confirmed로 업데이트
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "confirmed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orderId)
          .eq("clerk_id", user.id)
          .eq("status", "pending");

        if (updateError) throw updateError;

        // 결제 정보를 저장할 수 있다면 여기에 추가 (예: payments 테이블)
        // 현재는 주문 상태만 업데이트

        // 주문 상세 페이지로 리다이렉트
        router.push(`/orders/${orderId}?status=confirmed`);
      } catch (err) {
        console.error("Error confirming payment:", err);
        setError("결제 확인 중 오류가 발생했습니다.");
        setProcessing(false);
      }
    };

    confirmPayment();
  }, [isLoaded, user, orderId, paymentKey, supabase, router]);

  if (processing) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 animate-pulse text-green-500" />
          <p className="text-lg text-gray-600">결제를 확인하는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/my-page">
            <Button>주문 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return null; // 리다이렉트 중
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 animate-pulse text-green-500" />
          <p className="text-lg text-gray-600">결제를 확인하는 중...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

