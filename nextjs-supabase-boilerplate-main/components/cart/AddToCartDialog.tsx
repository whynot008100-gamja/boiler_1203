"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product;
  quantity: number;
  cartItemCount?: number;
}

export function AddToCartDialog({
  open,
  onOpenChange,
  product,
  quantity,
  cartItemCount = 0,
}: AddToCartDialogProps) {
  const router = useRouter();

  const handleGoToCart = () => {
    onOpenChange(false);
    router.push("/cart");
  };

  const handleContinueShopping = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle>장바구니에 추가되었습니다</DialogTitle>
          </div>
          <DialogDescription>
            선택하신 상품이 장바구니에 추가되었습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                수량: {quantity}개
              </p>
              <p className="text-lg font-bold text-primary">
                {(product.price * quantity).toLocaleString()}원
              </p>
            </div>
          </div>

          {cartItemCount > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
              현재 장바구니에 총 {cartItemCount}개의 상품이 있습니다.
            </p>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleContinueShopping}
            className="w-full sm:w-auto"
          >
            계속 쇼핑하기
          </Button>
          <Button onClick={handleGoToCart} className="w-full sm:w-auto">
            <ShoppingCart className="w-4 h-4 mr-2" />
            장바구니로 이동
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

