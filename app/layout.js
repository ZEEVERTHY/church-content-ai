import { Inter } from "next/font/google";
import "./globals.css";
import { DataSaverProvider } from "../components/ui/DataSaverMode";
import PerformanceMonitor from "../components/ui/PerformanceMonitor";
import { ThemeProvider } from "../components/theme-provider";

// Use system font for better performance
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const metadata = {
  title: "ChurchContentAI - AI Ministry Assistant",
  description: "AI-powered content creation tool for pastors and ministry leaders. Generate sermons and Bible studies with AI assistance while maintaining your unique pastoral voice.",
  keywords: "AI, ministry, pastor, sermon, Bible study, church, content creation, Nigeria",
  authors: [{ name: "ChurchContentAI Team" }],
  creator: "ChurchContentAI",
  publisher: "ChurchContentAI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://churchcontentai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "ChurchContentAI - AI Ministry Assistant",
    description: "AI-powered content creation tool for pastors and ministry leaders",
    url: '/',
    siteName: 'ChurchContentAI',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ChurchContentAI - AI Ministry Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ChurchContentAI - AI Ministry Assistant',
    description: 'AI-powered content creation tool for pastors and ministry leaders',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#4f46e5',
}

// Force dynamic rendering - prevent static generation
export const dynamic = 'force-dynamic'

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChurchContentAI" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        {/* Optimized font loading - Next.js handles preconnect automatically with next/font */}
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <DataSaverProvider>
            {children}
            {/* <PerformanceMonitor /> */}
          </DataSaverProvider>
        </ThemeProvider>
        {/* Defer service worker registration - non-blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                // Defer registration to not block page load
                setTimeout(function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                }, 2000);
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
