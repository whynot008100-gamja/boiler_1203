"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from "lucide-react";
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

export default function CartPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const supabase = useClerkSupabaseClient();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

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

      // 타입 변환
      const items = (data || []).map((item: any) => ({
        ...item,
        product: item.product as Product,
      }));

      setCartItems(items);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "장바구니를 가져오는 중 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error fetching cart items:", err);
    } finally {
      setLoading(false);
    }
  }, [user, supabase]);

  useEffect(() => {
    if (isLoaded) {
      fetchCartItems();
    }
  }, [isLoaded, fetchCartItems]);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(cartItemId);
      const { error: updateError } = await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", cartItemId);

      if (updateError) throw updateError;

      await fetchCartItems();
    } catch (err) {
      console.error("Error updating quantity:", err);
      alert("수량 변경 중 오류가 발생했습니다.");
    } finally {
      setUpdating(null);
    }
  };

  const removeItem = async (cartItemId: string) => {
    if (!confirm("정말 이 상품을 장바구니에서 제거하시겠습니까?")) return;

    try {
      setUpdating(cartItemId);
      const { error: deleteError } = await supabase
        .from("cart_items")
        .delete()
        .eq("id", cartItemId);

      if (deleteError) throw deleteError;

      await fetchCartItems();
    } catch (err) {
      console.error("Error removing item:", err);
      alert("상품 제거 중 오류가 발생했습니다.");
    } finally {
      setUpdating(null);
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  if (!isLoaded) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">장바구니를 사용하려면 먼저 로그인해주세요.</p>
          <Link href="/sign-in">
            <Button size="lg">로그인하기</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-12 h-12 mx-auto mb-4 animate-pulse text-primary" />
          <p className="text-lg text-gray-600">장바구니를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchCartItems}>다시 시도</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] max-w-7xl mx-auto px-8 py-8">
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          쇼핑 계속하기
        </Link>
        <h1 className="text-4xl font-bold">장바구니</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h2>
          <p className="text-gray-600 mb-6">원하는 상품을 장바구니에 추가해보세요.</p>
          <Link href="/products">
            <Button size="lg">
              <ShoppingBag className="w-5 h-5 mr-2" />
              상품 둘러보기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-6 flex gap-6"
                style={{ opacity: updating === item.id ? 0.5 : 1 }}
              >
                <Link href={`/products/${item.product.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                      {item.product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-primary mb-4">
                    {item.product.price.toLocaleString()}원
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={updating === item.id || item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        min={1}
                        max={item.product.stock_quantity}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          updateQuantity(
                            item.id,
                            Math.max(1, Math.min(item.product.stock_quantity, value))
                          );
                        }}
                        className="w-20 text-center"
                        disabled={updating === item.id}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={
                          updating === item.id || item.quantity >= item.product.stock_quantity
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={updating === item.id}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      삭제
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    소계: {(item.product.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">주문 요약</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품 수</span>
                  <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}개</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>총 결제금액</span>
                    <span className="text-primary">{totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => router.push("/checkout")}
                disabled={cartItems.length === 0}
              >
                주문하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

