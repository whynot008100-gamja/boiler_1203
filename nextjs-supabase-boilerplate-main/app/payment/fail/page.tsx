"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle, ArrowLeft } from "lucide-react";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const errorCode = searchParams.get("code");
  const errorMessage = searchParams.get("message");

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    if (errorCode) {
      const errorMessages: Record<string, string> = {
        USER_CANCEL: "결제가 취소되었습니다.",
        INVALID_CARD: "유효하지 않은 카드 정보입니다.",
        INSUFFICIENT_BALANCE: "잔액이 부족합니다.",
        EXCEED_MAX_AMOUNT: "최대 결제 금액을 초과했습니다.",
      };
      return errorMessages[errorCode] || "결제 중 오류가 발생했습니다.";
    }
    return "결제 중 오류가 발생했습니다.";
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
      <div className="text-center max-w-md">
        <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h1 className="text-2xl font-bold mb-4">결제 실패</h1>
        <p className="text-gray-600 mb-6">{getErrorMessage()}</p>
        <div className="flex flex-col gap-3">
          {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button variant="outline" className="w-full">
                주문 상세로 돌아가기
              </Button>
            </Link>
          )}
          <Link href="/my-page">
            <Button className="w-full">주문 내역으로 돌아가기</Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              쇼핑 계속하기
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 mx-auto mb-4 animate-pulse text-red-500" />
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      </div>
    }>
      <PaymentFailContent />
    </Suspense>
  );
}

