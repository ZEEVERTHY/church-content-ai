# Cache Fix Instructions

## ✅ FIXES APPLIED

### 1. Service Worker (public/sw.js)
- **Changed**: HTML pages are NO LONGER cached
- **Before**: HTML pages cached for 1 hour
- **After**: HTML pages always fetch fresh from network
- **Cache version**: Updated to v3 to force cache invalidation

### 2. Next.js Config (next.config.mjs)
- **Added**: Cache-Control headers to prevent HTML caching
- **Headers**: `no-cache, no-store, must-revalidate, max-age=0`
- **Pragma**: `no-cache`
- **Expires**: `0`

### 3. Root Layout (app/layout.js)
- **Added**: `export const dynamic = 'force-dynamic'`
- **Added**: `export const revalidate = 0`
- **Effect**: Prevents static generation and caching

## 🚀 HOW TO APPLY FIXES

### Step 1: Clear Browser Cache
1. Open browser DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Check all boxes
5. Click "Clear site data"

### Step 2: Unregister Service Worker
1. In DevTools, go to Application tab
2. Click "Service Workers" in left sidebar
3. Click "Unregister" for any registered service workers
4. Refresh the page

### Step 3: Hard Refresh
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

### Step 4: Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
# Clear Next.js cache
rm -rf .next
# Restart
npm run dev
```

## 🔍 VERIFICATION

After applying fixes, you should:
1. ✅ See changes immediately without clearing cache
2. ✅ No need to hard refresh every hour
3. ✅ Service worker shows "v3" in console
4. ✅ Network tab shows `Cache-Control: no-cache` for HTML pages

## 📝 WHAT WAS FIXED

### Problem
- Service worker was caching HTML pages for 1 hour
- Next.js was potentially statically generating pages
- Browser was caching HTML responses

### Solution
- Service worker now NEVER caches HTML pages
- Only caches static assets (JS, CSS, images)
- Added explicit no-cache headers
- Force dynamic rendering in layout

## ⚠️ IMPORTANT NOTES

1. **Static assets** (JS, CSS, images) are still cached for performance
2. **HTML pages** are never cached - always fresh
3. **API routes** are never cached
4. Service worker version updated to v3 - old caches will be cleared automatically

## 🐛 IF ISSUES PERSIST

1. Clear all browser data for the site
2. Unregister service worker
3. Restart dev server
4. Hard refresh (Ctrl+Shift+R)
5. Check Network tab - HTML should show `Cache-Control: no-cache`
