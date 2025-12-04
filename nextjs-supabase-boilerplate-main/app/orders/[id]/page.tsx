"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react";

interface Order {
  id: string;
  clerk_id: string;
  total_amount: number;
  status: string;
  shipping_address: any;
  order_note: string | null;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const orderId = params.id as string;
  const status = searchParams.get("status");

  const [order, setOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isLoaded || !user || !orderId) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError(null);

        // 주문 정보 가져오기
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("clerk_id", user.id)
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error("주문을 찾을 수 없습니다.");

        setOrder(orderData);

        // 주문 상세 아이템 가져오기
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId)
          .order("created_at", { ascending: false });

        if (itemsError) throw itemsError;
        setOrderItems(itemsData || []);
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

  const handleCancelOrder = async () => {
    if (!order || order.status !== "pending") return;

    if (!confirm("정말 이 주문을 취소하시겠습니까?")) return;

    try {
      setCancelling(true);
      const { error: updateError } = await supabase
        .from("orders")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id)
        .eq("clerk_id", user?.id || "");

      if (updateError) throw updateError;

      // 주문 정보 다시 불러오기
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .eq("clerk_id", user?.id || "")
        .single();

      if (orderError) throw orderError;
      if (orderData) setOrder(orderData);

      alert("주문이 취소되었습니다.");
    } catch (err) {
      console.error("Error cancelling order:", err);
      alert("주문 취소 중 오류가 발생했습니다.");
    } finally {
      setCancelling(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-gray-600">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (error || !order) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error || "주문을 찾을 수 없습니다."}</p>
          <Link href="/my-page">
            <Button>주문 내역으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "결제 대기",
      confirmed: "주문 확인",
      shipped: "배송 중",
      delivered: "배송 완료",
      cancelled: "취소됨",
    };
    return labels[status] || status;
  };

  const isPending = status === "pending" || order.status === "pending";

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-4xl mx-auto px-8 py-8">
      <div className="mb-8">
        <Link
          href={isPending ? "/checkout" : "/my-page"}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          {isPending ? "주문하기로 돌아가기" : "주문 내역으로 돌아가기"}
        </Link>
        <h1 className="text-4xl font-bold">주문 상세</h1>
      </div>

      {/* 주문 상태 */}
      <div className="border rounded-lg p-6 mb-6">
        {isPending ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">주문이 접수되었습니다</h2>
            <p className="text-gray-600 mb-6">
              결제를 완료하면 주문이 확정됩니다. (현재는 테스트 모드입니다)
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">주문 번호: {order.id}</p>
              <p className="text-sm text-gray-500">
                주문일시: {new Date(order.created_at).toLocaleString("ko-KR")}
              </p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg font-semibold">주문 상태:</span>
              <span className="text-lg">{getStatusLabel(order.status)}</span>
            </div>
            <p className="text-sm text-gray-600">
              주문 번호: {order.id}
            </p>
            <p className="text-sm text-gray-600">
              주문일시: {new Date(order.created_at).toLocaleString("ko-KR")}
            </p>
          </div>
        )}
      </div>

      {/* 주문 상품 */}
      <div className="border rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6">주문 상품</h2>
        <div className="space-y-4">
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-4 border-b last:border-0">
              <div>
                <h3 className="font-semibold">{item.product_name}</h3>
                <p className="text-sm text-gray-600">
                  {item.price.toLocaleString()}원 x {item.quantity}개
                </p>
              </div>
              <span className="font-bold">
                {(item.price * item.quantity).toLocaleString()}원
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between text-xl font-bold">
            <span>총 결제금액</span>
            <span className="text-primary">{order.total_amount.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* 배송지 정보 */}
      {order.shipping_address && (
        <div className="border rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6">배송지 정보</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-semibold">받는 분:</span> {order.shipping_address.name}
            </p>
            <p>
              <span className="font-semibold">연락처:</span> {order.shipping_address.phone}
            </p>
            <p>
              <span className="font-semibold">주소:</span> [{order.shipping_address.zipCode}]{" "}
              {order.shipping_address.address}
              {order.shipping_address.addressDetail && ` ${order.shipping_address.addressDetail}`}
            </p>
            {order.order_note && (
              <p>
                <span className="font-semibold">배송 요청사항:</span> {order.order_note}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 액션 버튼 */}
      <div className="flex gap-4">
        {isPending ? (
          <>
            <Link href={`/payment/${order.id}`} className="flex-1">
              <Button size="lg" className="w-full">
                <CreditCard className="w-5 h-5 mr-2" />
                결제하기
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? "취소 중..." : "주문 취소"}
            </Button>
            <Link href="/products" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                쇼핑 계속하기
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/products" className="flex-1">
              <Button variant="outline" className="w-full">
                쇼핑 계속하기
              </Button>
            </Link>
            <Link href="/my-page" className="flex-1">
              <Button className="w-full">주문 내역 보기</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

