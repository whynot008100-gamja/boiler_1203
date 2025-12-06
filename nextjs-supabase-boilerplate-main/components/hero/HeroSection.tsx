"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Star,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const floatingVariants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [-5, 5, -5],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

const features = [
  { icon: Truck, label: "무료 배송", desc: "5만원 이상 구매 시" },
  { icon: Shield, label: "안전 결제", desc: "토스페이먼츠 연동" },
  { icon: RefreshCw, label: "무료 교환", desc: "7일 이내 교환 가능" },
];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/10" />

      {/* Floating Decorative Elements */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "2s" }}
        className="absolute top-40 right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-chart-4/20 to-chart-4/5 blur-xl"
      />
      <motion.div
        variants={floatingVariants}
        animate="animate"
        style={{ animationDelay: "4s" }}
        className="absolute bottom-32 left-[20%] w-24 h-24 rounded-full bg-gradient-to-br from-chart-2/20 to-chart-2/5 blur-xl"
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                2026년을 맞이하며
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]"
            >
              <span className="text-foreground">당신만의 멋진</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-chart-4 to-primary bg-clip-text text-transparent animate-gradient">
                LIFE STYLE
                <br />
                내꼬야로 해결!
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed"
            >
              트렌디한 패션 아이템부터 일상의 필수품까지.
              <br />
              엄선된 상품을 합리적인 가격에 만나보세요.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/products">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                  >
                    쇼핑 시작하기
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href="/products?category=clothing">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 px-8 text-base font-semibold border-2 hover:bg-accent/50 transition-all duration-300"
                  >
                    신상품 보기
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  4.9/5 고객 만족도
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            {/* Main Visual Card */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="relative z-10 rounded-3xl overflow-hidden bg-gradient-to-br from-primary/90 to-chart-4/90 p-8 sm:p-12 shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative z-10 text-white">
                  <p className="text-sm font-medium opacity-80 mb-2">
                    이번 시즌 베스트
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                    최대 40% 할인
                  </h3>
                  <p className="text-white/80 mb-6">
                    인기 상품을 특별한 가격에 만나보세요
                  </p>
                  <Link href="/products">
                    <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-foreground font-semibold rounded-full hover:bg-white/90 transition-colors">
                      지금 쇼핑하기
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>

                {/* Decorative shapes */}
                <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -left-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-xl" />
              </motion.div>

              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-chart-4/30 rounded-3xl blur-3xl opacity-50" />
            </div>

            {/* Floating Feature Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-8 -left-8 z-20"
            >
              <div className="glass rounded-2xl p-4 shadow-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Truck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">무료 배송</p>
                    <p className="text-sm text-muted-foreground">
                      5만원 이상 구매 시
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="absolute -top-4 -right-4 z-20"
            >
              <div className="glass rounded-2xl p-4 shadow-xl border border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-chart-2/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-chart-2" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">안전 결제</p>
                    <p className="text-sm text-muted-foreground">
                      토스페이먼츠
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Features Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{feature.label}</p>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
