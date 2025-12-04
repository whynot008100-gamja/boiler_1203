"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export function CartBadge() {
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setItemCount(0);
      return;
    }

    const fetchCartCount = async () => {
      try {
        const { count, error } = await supabase
          .from("cart_items")
          .select("*", { count: "exact", head: true })
          .eq("clerk_id", user.id);

        if (error) throw error;
        setItemCount(count || 0);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount();

    // 실시간 업데이트를 위한 구독 (선택사항)
    const channel = supabase
      .channel("cart-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "cart_items",
          filter: `clerk_id=eq.${user.id}`,
        },
        () => {
          fetchCartCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  if (itemCount === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {itemCount > 99 ? "99+" : itemCount}
    </span>
  );
}

