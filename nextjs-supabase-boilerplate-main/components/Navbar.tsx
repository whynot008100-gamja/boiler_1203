import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Store } from "lucide-react";
import { CartBadge } from "./CartBadge";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center px-6 lg:px-8 gap-4 h-16 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-chart-4 flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-all duration-300">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            내꼬야
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-2 items-center">
          <Link href="/products">
            <Button variant="ghost" className="text-sm font-medium hover:bg-accent">
              상품
            </Button>
          </Link>
          
          {/* 장바구니 아이콘 */}
          <SignedIn>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" aria-label="장바구니" className="relative hover:bg-accent">
                <ShoppingCart className="h-5 w-5" />
                <CartBadge />
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="icon" aria-label="장바구니 (로그인 필요)" className="hover:bg-accent">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </SignInButton>
          </SignedOut>

          {/* 마이페이지 */}
          <SignedIn>
            <Link href="/my-page">
              <Button variant="ghost" size="icon" aria-label="마이페이지" className="hover:bg-accent">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </SignedIn>

          {/* 구분선 */}
          <div className="w-px h-6 bg-border mx-2" />

          {/* 인증 버튼 */}
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                로그인
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300"
                }
              }}
            />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
