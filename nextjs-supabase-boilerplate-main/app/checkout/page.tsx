"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";

interface CartItem {
  id: string;
  clerk_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    phone: "",
    address: "",
    addressDetail: "",
    zipCode: "",
  });
  const [orderNote, setOrderNote] = useState("");

  const fetchCartItems = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from("cart_items")
        .select(
          `
          *,
          product:products(*)
        `
        )
        .eq("clerk_id", user.id)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      const items = (data || []).map((item: any) => ({
        ...item,
        product: item.product as Product,
      }));

      setCartItems(items);

      if (items.length === 0) {
        router.push("/cart");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "장바구니를 가져오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error fetching cart items:", err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, router]);

  useEffect(() => {
    if (isLoaded) {
      fetchCartItems();
    }
  }, [isLoaded, fetchCartItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || cartItems.length === 0) return;

    // 배송지 정보 검증
    if (
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.zipCode
    ) {
      alert("배송지 정보를 모두 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      // 주문 생성
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          clerk_id: user.id,
          total_amount: totalAmount,
          status: "pending",
          shipping_address: shippingAddress,
          order_note: orderNote || null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 주문 상세 아이템 생성
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      if (itemsError) throw itemsError;

      // 장바구니 비우기
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("clerk_id", user.id);

      if (deleteError) throw deleteError;

      // 결제 페이지로 이동
      router.push(`/payment/${order.id}`);
    } catch (err) {
      console.error("Error creating order:", err);
      const errorMessage =
        err instanceof Error ? err.message : "주문 생성 중 오류가 발생했습니다.";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/cart">
            <Button>장바구니로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          장바구니로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold">주문하기</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 배송지 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">배송지 정보</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">받는 분 이름 *</Label>
                  <Input
                    id="name"
                    value={shippingAddress.name}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">연락처 *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, phone: e.target.value })
                    }
                    placeholder="010-1234-5678"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">우편번호 *</Label>
                  <Input
                    id="zipCode"
                    value={shippingAddress.zipCode}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, zipCode: e.target.value })
                    }
                    placeholder="12345"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">주소 *</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, address: e.target.value })
                    }
                    placeholder="서울시 강남구 테헤란로 123"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="addressDetail">상세주소</Label>
                  <Input
                    id="addressDetail"
                    value={shippingAddress.addressDetail}
                    onChange={(e) =>
                      setShippingAddress({ ...shippingAddress, addressDetail: e.target.value })
                    }
                    placeholder="101동 101호"
                  />
                </div>
                <div>
                  <Label htmlFor="orderNote">배송 요청사항</Label>
                  <Textarea
                    id="orderNote"
                    value={orderNote}
                    onChange={(e) => setOrderNote(e.target.value)}
                    placeholder="배송 시 요청사항을 입력해주세요"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">주문 요약</h2>
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>{(item.product.price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>총 결제금액</span>
                    <span className="text-primary">{totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? "주문 처리 중..." : "주문하기"}
              </Button>
              <p className="text-xs text-gray-500 mt-4 text-center">
                주문 후 결제 페이지로 이동합니다
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

