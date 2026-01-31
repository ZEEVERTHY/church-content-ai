'use client'

import { useState, useEffect, memo } from "react";
import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

// Memoize to prevent unnecessary re-renders
export const AnimatedHeroLanding = memo(function AnimatedHeroLanding() {
  // Symmetric pillar heights (percent). Tall at edges, low at center.
  const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];

  // State to trigger animations once the component is mounted.
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Set isMounted to true after a short delay to allow the component to render first.
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Custom CSS animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes subtlePulse {
            0%, 100% {
              opacity: 0.8;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.03);
            }
          }
          
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
          }
        `}
      </style>

      <section className="relative isolate h-screen overflow-hidden bg-black text-white">
        {/* ================== BACKGROUND ================== */}
        {/* Luminous elliptical gradients - Ministry-inspired colors (indigo, purple, warm tones) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage: [
              // Main central dome/band - warm ministry colors
              "radial-gradient(80% 55% at 50% 52%, rgba(139,92,246,0.45) 0%, rgba(99,102,241,0.46) 27%, rgba(79,70,229,0.38) 47%, rgba(67,56,202,0.45) 60%, rgba(8,8,12,0.92) 78%, rgba(0,0,0,1) 88%)",
              // Warm sweep from top-left - golden/amber tones
              "radial-gradient(85% 60% at 14% 0%, rgba(251,191,36,0.65) 0%, rgba(245,158,11,0.58) 30%, rgba(48,24,28,0.0) 64%)",
              // Cool rim on top-right - indigo/blue
              "radial-gradient(70% 50% at 86% 22%, rgba(99,102,241,0.40) 0%, rgba(16,18,28,0.0) 55%)",
              // Soft top vignette
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0) 40%)",
            ].join(","),
            backgroundColor: "#000",
          }}
        />

        {/* Vignette corners for extra contrast */}
        <div aria-hidden className="absolute inset-0 -z-20 bg-[radial-gradient(140%_120%_at_50%_0%,transparent_60%,rgba(0,0,0,0.85))]" />

        {/* Grid overlay: vertical columns + subtle curved horizontal arcs */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-30"
          style={{
            backgroundImage: [
              // Vertical grid lines (major & minor)
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.09) 0 1px, transparent 1px 96px)",
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 24px)",
              // Curved horizontal arcs via repeating elliptical radial gradient
              "repeating-radial-gradient(80% 55% at 50% 52%, rgba(255,255,255,0.08) 0 1px, transparent 1px 120px)"
            ].join(","),
            backgroundBlendMode: "screen",
          }}
        />

        {/* ================== NAV ================== */}
        <header className="relative z-10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-semibold tracking-tight">ChurchContentAI</span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/testimonials" className="hover:text-white transition-colors">Testimonials</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <Link href="/auth" className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors">
                Sign in
              </Link>
              <Link href="/auth" className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-white/90">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden rounded-full bg-white/10 px-3 py-2 text-sm hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-black/95 backdrop-blur border-b border-white/10">
            <nav className="flex flex-col px-6 py-4 space-y-3">
              <Link 
                href="/about" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white transition-colors py-2"
              >
                About
              </Link>
              <Link 
                href="/testimonials" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white transition-colors py-2"
              >
                Testimonials
              </Link>
              <Link 
                href="/pricing" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white transition-colors py-2"
              >
                Pricing
              </Link>
              <Link 
                href="/support" 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white/80 hover:text-white transition-colors py-2"
              >
                Support
              </Link>
              <div className="pt-3 border-t border-white/10 space-y-2">
                <Link 
                  href="/auth" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link 
                  href="/auth" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-white/90"
                >
                  Get Started
                </Link>
              </div>
            </nav>
          </div>
        )}

        {/* ================== COPY ================== */}
        <div className="relative z-10 mx-auto grid w-full max-w-5xl place-items-center px-6 py-16 md:py-24 lg:py-28">
          <div className={`mx-auto text-center ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70 ring-1 ring-white/10 backdrop-blur">
              <Sparkles className="h-1.5 w-1.5 text-white/70" /> AI Ministry Assistant
            </span>
            <h1 
              style={{ animationDelay: '200ms' }} 
              className={`mt-6 text-4xl font-bold tracking-tight md:text-6xl ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}
            >
              Turn Your Burden Into a Clear, Biblical Message
            </h1>
            <p 
              style={{ animationDelay: '300ms' }} 
              className={`mx-auto mt-5 max-w-2xl text-balance text-white/80 md:text-lg ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}
            >
              We help you structure, apply, and communicate God&apos;s word with clarity. 
              AI-powered assistance that respects your pastoral authority and enhances your unique voice.
            </p>
            <div 
              style={{ animationDelay: '400ms' }} 
              className={`mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row ${isMounted ? 'animate-fadeInUp' : 'opacity-0'}`}
            >
              <Link 
                href="/auth" 
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-black shadow transition hover:bg-white/90"
              >
                Start Creating
              </Link>
              <Link 
                href="/pricing" 
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:border-white/40 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>

        {/* ================== TRUST INDICATORS ================== */}
        <div className="relative z-10 mx-auto mt-10 w-full max-w-6xl px-6 pb-24">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {["500+ Active Pastors", "10,000+ Sermons", "SSL Secured", "30-Day Guarantee"].map((item) => (
              <div key={item} className="text-xs uppercase tracking-wider text-white/70">{item}</div>
            ))}
          </div>
        </div>

        {/* ================== FOREGROUND ================== */}
        {/* Center-bottom rectangular glow with pulse animation - warm golden tone */}
        <div
          className="pointer-events-none absolute bottom-[128px] left-1/2 z-0 h-36 w-28 -translate-x-1/2 rounded-md bg-gradient-to-b from-amber-200/75 via-purple-200/60 to-transparent"
          style={{ animation: 'subtlePulse 6s ease-in-out infinite' }}
        />

        {/* Stepped pillars silhouette */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[54vh]">
          {/* dark fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
          {/* bars */}
          <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
            {pillars.map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-black transition-height duration-1000 ease-in-out"
                style={{
                  height: isMounted ? `${h}%` : '0%',
                  transitionDelay: `${Math.abs(i - Math.floor(pillars.length / 2)) * 60}ms`
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
})
