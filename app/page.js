'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import Layout from '../components/layout/Layout'
import { BookOpen, Sparkles, Zap, CheckCircle2, ArrowRight, Shield } from 'lucide-react'
import dynamic from 'next/dynamic'

// Lazy load heavy animated hero component for better performance
const AnimatedHeroLanding = dynamic(
  () => import('../components/ui/animated-hero-landing').then(mod => ({ default: mod.AnimatedHeroLanding })),
  {
    loading: () => <div className="h-screen bg-black" />,
    ssr: false
  }
)

export default function Home() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Redirect logged-in users immediately to dashboard
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          router.push('/dashboard')
          return // Exit early if redirecting
        }
      } catch (error) {
        // Ignore errors, just show homepage
      }
      // Only trigger animations if not redirecting
      const timer = setTimeout(() => setIsVisible(true), 100)
      return () => clearTimeout(timer)
    }
    checkSession()
  }, [router])

  return (
    <Layout showNavigation={false}>
      <main>
        {/* Animated Hero Section - Full Screen */}
        <AnimatedHeroLanding />

        {/* Features Section - Dark Modern Style */}
        <section className="relative py-32 overflow-hidden bg-black text-white">
          {/* Background Gradient */}
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: [
                "radial-gradient(80% 50% at 50% 50%, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(0,0,0,1) 100%)",
                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,1))"
              ].join(",")
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`text-center mb-20 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Ministry Tools That Support Your Calling
              </h3>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                AI-powered assistance that respects your pastoral authority and enhances your unique voice
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "Sermon Preparation",
                  description: "Get AI-generated outlines and talking points to jumpstart your sermon preparation, then add your personal insights and pastoral wisdom.",
                  gradient: "from-purple-500/20 to-indigo-500/20",
                  iconColor: "text-purple-400"
                },
                {
                  icon: Sparkles,
                  title: "Bible Study Resources",
                  description: "Create structured Bible study guides that complement your teaching style and meet your congregation's spiritual needs.",
                  gradient: "from-amber-500/20 to-orange-500/20",
                  iconColor: "text-amber-400"
                },
                {
                  icon: Zap,
                  title: "Pastor-First Design",
                  description: "Built specifically for pastors, with theological accuracy and respect for your pastoral authority and calling.",
                  gradient: "from-indigo-500/20 to-purple-500/20",
                  iconColor: "text-indigo-400"
                }
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                    </div>
                    <h4 className="text-xl font-semibold mb-3 text-white">{feature.title}</h4>
                    <p className="text-white/70 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Value Proposition - Dark Modern Style */}
        <section className="relative py-32 overflow-hidden bg-black text-white">
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: [
                "radial-gradient(60% 80% at 20% 50%, rgba(99,102,241,0.2) 0%, rgba(0,0,0,1) 70%)",
                "radial-gradient(60% 80% at 80% 50%, rgba(139,92,246,0.2) 0%, rgba(0,0,0,1) 70%)"
              ].join(",")
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                  More Time for What Matters Most
                </h3>
                <p className="text-lg text-white/70 mb-8 leading-relaxed">
                  Reduce preparation time without compromising the quality of your ministry. 
                  Use AI as your research assistant while you focus on prayer, pastoral care, 
                  and building relationships with your congregation.
                </p>
                <div className="space-y-4">
                  {[
                    "Spend more time in prayer and pastoral care",
                    "Theologically sound foundation for your messages",
                    "Enhance your unique pastoral voice, not replace it"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center group">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className={`relative transition-opacity duration-1000 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                <div className="relative p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-transparent backdrop-blur-sm">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 opacity-50" />
                  <div className="relative z-10 text-center">
                    <div className="text-8xl font-bold bg-gradient-to-r from-amber-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
                      3x
                    </div>
                    <p className="text-xl text-white/80">Faster content creation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview - Dark Modern Style */}
        <section className="relative py-32 overflow-hidden bg-black text-white">
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: [
                "radial-gradient(70% 60% at 50% 50%, rgba(139,92,246,0.15) 0%, rgba(99,102,241,0.1) 50%, rgba(0,0,0,1) 100%)"
              ].join(",")
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`text-center mb-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Simple, Transparent Pricing
              </h3>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Start free, upgrade when you need more
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Free Plan */}
              <div className={`group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h4 className="text-2xl font-bold text-white mb-2">Free Plan</h4>
                <div className="text-5xl font-bold text-white mb-4">₦0</div>
                <ul className="space-y-4 mb-8">
                  {["3 generations per month", "Basic AI assistance"].map((item, idx) => (
                    <li key={idx} className="flex items-center text-white/80">
                      <CheckCircle2 className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/auth"
                  className="block w-full text-center rounded-full px-6 py-3 text-sm font-semibold border border-white/20 text-white hover:bg-white/10 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              {/* Premium Plan */}
              <div className={`group relative p-8 rounded-2xl border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/20 via-indigo-500/20 to-transparent backdrop-blur-sm hover:border-purple-400/80 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">Premium Plan</h4>
                <div className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  ₦5,000
                </div>
                <p className="text-white/70 mb-6">per month</p>
                <ul className="space-y-4 mb-8">
                  {["Unlimited generations", "Advanced AI features", "Priority support"].map((item, idx) => (
                    <li key={idx} className="flex items-center text-white/90">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 mr-3 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link 
                  href="/pricing"
                  className="block w-full text-center rounded-full px-6 py-3 text-sm font-semibold bg-white text-black hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                >
                  Upgrade Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content Preview Section - Dark Modern Style */}
        <section className="relative py-32 overflow-hidden bg-black text-white">
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: [
                "radial-gradient(50% 50% at 50% 50%, rgba(99,102,241,0.1) 0%, rgba(0,0,0,1) 100%)"
              ].join(",")
            }}
          />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className={`text-center mb-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                See It In Action
              </h3>
              <p className="text-lg text-white/70 max-w-3xl mx-auto">
                Get a preview of how ChurchContentAI can help you create powerful, Biblically sound content for your ministry
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Sample Sermon Preview */}
              <div className={`group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-indigo-500/30 flex items-center justify-center mr-4">
                      <BookOpen className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">Sample Sermon Outline</h4>
                      <p className="text-white/70 text-sm">Topic: &ldquo;Faith in Difficult Times&rdquo; | Romans 8:28</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { title: "I. The Reality of Trials", desc: "Every believer faces challenges, but God uses them for our growth...", color: "border-purple-500/50" },
                      { title: "II. God's Purpose in Pain", desc: "Romans 8:28 reminds us that God works all things together for good...", color: "border-amber-500/50" },
                      { title: "III. Practical Steps Forward", desc: "How to maintain faith and find hope in the midst of difficulty...", color: "border-indigo-500/50" }
                    ].map((item, idx) => (
                      <div key={idx} className={`border-l-4 ${item.color} pl-4`}>
                        <h5 className="font-semibold text-white mb-2">{item.title}</h5>
                        <p className="text-white/70 text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Bible Study Preview */}
              <div className={`group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/30 to-purple-500/30 flex items-center justify-center mr-4">
                      <Sparkles className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white">Sample Bible Study Guide</h4>
                      <p className="text-white/70 text-sm">Topic: &ldquo;The Fruit of the Spirit&rdquo; | Galatians 5:22-23</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      { title: "Opening Discussion (10 min)", desc: "What does it mean to live a Spirit-filled life?", gradient: "from-purple-500/20 to-indigo-500/20" },
                      { title: "Scripture Study (20 min)", desc: "Read Galatians 5:22-23 and discuss each fruit...", gradient: "from-indigo-500/20 to-purple-500/20" },
                      { title: "Application (15 min)", desc: "How can we cultivate these fruits in our daily lives?", gradient: "from-amber-500/20 to-purple-500/20" }
                    ].map((item, idx) => (
                      <div key={idx} className={`rounded-lg p-4 bg-gradient-to-br ${item.gradient} border border-white/10`}>
                        <h5 className="font-semibold text-white mb-2">{item.title}</h5>
                        <p className="text-white/80 text-sm">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`text-center mt-12 transition-opacity duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <Link
                href="/testimonials"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 font-medium transition-colors group"
              >
                See more examples from real pastors
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action - Dark Modern Style */}
        <section className="relative py-32 overflow-hidden bg-black text-white">
          <div 
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: [
                "radial-gradient(80% 60% at 50% 50%, rgba(139,92,246,0.3) 0%, rgba(99,102,241,0.2) 50%, rgba(0,0,0,1) 100%)",
                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,1))"
              ].join(",")
            }}
          />
          
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h3 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-indigo-200 bg-clip-text text-transparent">
                Ready to Enhance Your Ministry?
              </h3>
              <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join fellow pastors who are using AI as a tool to support their calling, not replace their pastoral wisdom and personal touch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth"
                  className="group inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-black hover:bg-white/90 transition-all hover:scale-105 shadow-lg shadow-purple-500/20"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/testimonials"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white/30 bg-white/5 backdrop-blur-sm px-8 py-4 text-base font-semibold text-white hover:bg-white/10 hover:border-white/50 transition-all"
                >
                  See Success Stories
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Dark Modern Style */}
      <footer className="relative bg-black text-white py-16 border-t border-white/10">
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: [
              "radial-gradient(50% 50% at 50% 100%, rgba(99,102,241,0.1) 0%, rgba(0,0,0,1) 100%)"
            ].join(",")
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <h4 className="text-2xl font-bold">ChurchContentAI</h4>
              </div>
              <p className="text-white/70 mb-6 max-w-md leading-relaxed">
                Empowering pastors with AI technology while preserving the sacred calling of ministry. 
                Supporting 500+ pastors worldwide.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center text-sm text-white/60">
                  <Shield className="w-4 h-4 mr-2 text-purple-400" />
                  SSL Secured
                </div>
                <div className="flex items-center text-sm text-white/60">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" />
                  GDPR Compliant
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-white">Quick Links</h5>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "About Us" },
                  { href: "/testimonials", label: "Testimonials" },
                  { href: "/pricing", label: "Pricing" },
                  { href: "/support", label: "Support" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h5 className="text-lg font-semibold mb-4 text-white">Legal</h5>
              <ul className="space-y-3">
                {[
                  { href: "/privacy", label: "Privacy Policy" },
                  { href: "/terms", label: "Terms of Service" },
                  { href: "/feedback", label: "Contact" }
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-white/70 hover:text-white transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 text-center">
            <p className="text-white/60">
              © 2024 ChurchContentAI. All rights reserved. | Built with ❤️ for pastors worldwide
            </p>
          </div>
        </div>
      </footer>
    </Layout>
  )
}