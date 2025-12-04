"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, CreditCard, XCircle } from "lucide-react";
import { loadPaymentWidget, PaymentWidgetInstance } from "@tosspayments/payment-widget-sdk";

interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  order_note: string | null;
  created_at: string;
}

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const orderId = params.orderId as string;

  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
  const paymentMethodsWidgetRef = useRef<ReturnType<PaymentWidgetInstance["renderPaymentMethods"]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Toss Payments 클라이언트 키 (테스트 모드)
  const CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY || "test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq";

  useEffect(() => {
    if (!isLoaded || !user || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("clerk_id", user.id)
          .eq("status", "pending")
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error("결제 대기 중인 주문을 찾을 수 없습니다.");

        setOrder(orderData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "주문 정보를 가져오는 중 오류가 발생했습니다.";
        setError(errorMessage);
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [isLoaded, user, orderId, supabase]);

  useEffect(() => {
    if (!order || !CLIENT_KEY) return;

    const initializePaymentWidget = async () => {
      try {
        // 결제 위젯 초기화
        const paymentWidget = await loadPaymentWidget(CLIENT_KEY, user?.id || "anonymous");
        paymentWidgetRef.current = paymentWidget;

        // 결제 수단 위젯 렌더링
        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
          "#payment-widget",
          { value: order.total_amount, currency: "KRW" },
          { variantKey: "DEFAULT" }
        );
        paymentMethodsWidgetRef.current = paymentMethodsWidget;

        // 이용약관 위젯 렌더링
        paymentWidget.renderAgreement("#agreement", { variantKey: "AGREEMENT" });
      } catch (err) {
        console.error("Error initializing payment widget:", err);
        setError("결제 위젯을 초기화하는 중 오류가 발생했습니다.");
      }
    };

    initializePaymentWidget();

    return () => {
      // 정리 (위젯은 자동으로 정리됨)
    };
  }, [order, CLIENT_KEY, user?.id]);

  const handlePayment = async () => {
    if (!paymentWidgetRef.current || !order || !user) return;

    try {
      setProcessing(true);
      setError(null);

      // 결제 요청
      await paymentWidgetRef.current.requestPayment({
        orderId: order.id,
        orderName: `주문 #${order.id.slice(0, 8)}`,
        successUrl: `${window.location.origin}/payment/success?orderId=${order.id}`,
        failUrl: `${window.location.origin}/payment/fail?orderId=${order.id}`,
        customerEmail: user.emailAddresses[0]?.emailAddress || undefined,
        customerName: user.fullName || undefined,
      });
    } catch (err) {
      console.error("Error requesting payment:", err);
      setError("결제 요청 중 오류가 발생했습니다.");
      setProcessing(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-gray-600">결제 페이지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (error && !order) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/my-page">
            <Button>주문 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <p className="text-gray-600 mb-4">주문 정보를 찾을 수 없습니다.</p>
          <Link href="/my-page">
            <Button>주문 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-4xl mx-auto px-8 py-8">
      <div className="mb-8">
        <Link
          href={`/orders/${order.id}`}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          주문 상세로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold">결제하기</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 결제 위젯 */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">결제 수단 선택</h2>
            <div id="payment-widget" className="mb-6"></div>
            <div id="agreement"></div>
          </div>
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="text-2xl font-bold mb-6">주문 요약</h2>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>주문 번호</span>
                <span className="text-sm">{order.id.slice(0, 8)}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>총 결제금액</span>
                  <span className="text-primary">{order.total_amount.toLocaleString()}원</span>
                </div>
              </div>
            </div>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <Button
              size="lg"
              className="w-full"
              onClick={handlePayment}
              disabled={processing || !paymentWidgetRef.current}
            >
              {processing ? "결제 처리 중..." : `${order.total_amount.toLocaleString()}원 결제하기`}
            </Button>
            <p className="text-xs text-gray-500 mt-4 text-center">
              테스트 모드로 운영 중입니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

