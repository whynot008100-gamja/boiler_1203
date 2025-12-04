import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User } from "lucide-react";
import { CartBadge } from "./CartBadge";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold">
          쇼핑몰
        </Link>
        <nav className="flex gap-6 items-center">
          <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
            상품
          </Link>
          <SignedIn>
            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                <CartBadge />
              </Button>
            </Link>
            <Link href="/my-page" className="relative">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button>로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
