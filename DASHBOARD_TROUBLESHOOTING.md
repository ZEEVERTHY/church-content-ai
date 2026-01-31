# 🔧 Dashboard Troubleshooting Guide

If you're seeing the old dashboard design after login, follow these steps:

## ✅ Quick Fixes

### 1. **Clear Browser Cache**
The browser might be caching the old dashboard. Try:
- **Chrome/Edge**: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- **Firefox**: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Or clear cache manually in browser settings

### 2. **Restart Dev Server**
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 3. **Check Browser Console**
Open browser DevTools (F12) and check for errors:
- Look for red error messages
- Check if components are loading
- Verify no import errors

## 🔍 Verification Steps

### Check if SimpleUI is Loading

1. **Open browser DevTools** (F12)
2. **Go to Console tab**
3. **Look for errors** related to:
   - `SimpleUI`
   - `AIInputWithSearch`
   - `framer-motion`
   - CSS variables

### Check File Structure

Verify these files exist:
- ✅ `components/ui/simple-ui.js`
- ✅ `components/ui/ai-input-with-search.js`
- ✅ `components/ui/limit-modal.js`
- ✅ `lib/utils.js`
- ✅ `lib/constants.js`

### Check Dependencies

Run this to verify all dependencies are installed:
```bash
npm list framer-motion clsx tailwind-merge lucide-react
```

All should show as installed.

## 🐛 Common Issues

### Issue 1: "Module not found" errors
**Solution**: 
- Check that all files are in the correct locations
- Verify import paths use `@/` alias correctly
- Restart dev server

### Issue 2: CSS not applying
**Solution**:
- Check `app/globals.css` has CSS variables
- Verify Tailwind is processing classes
- Check browser DevTools to see if styles are applied

### Issue 3: Component renders but looks broken
**Solution**:
- Check CSS variables are defined in `globals.css`
- Verify inline styles are working (check in DevTools)
- Make sure `framer-motion` is installed

### Issue 4: Still seeing old dashboard
**Solution**:
1. **Hard refresh**: `Ctrl+Shift+R` or `Cmd+Shift+R`
2. **Clear Next.js cache**: Delete `.next` folder and restart
3. **Check file**: Verify `app/dashboard/page.js` imports `SimpleUI`

## 🔄 Force Refresh Steps

1. **Stop dev server** (Ctrl+C)
2. **Delete `.next` folder**:
   ```bash
   rm -rf .next
   # Or on Windows PowerShell:
   Remove-Item -Recurse -Force .next
   ```
3. **Restart dev server**:
   ```bash
   npm run dev
   ```
4. **Hard refresh browser**: `Ctrl+Shift+R`

## ✅ Expected Behavior

When working correctly, you should see:

1. **Navigation bar** at the top
2. **Greeting**: "Good morning/afternoon/evening, [Name]"
3. **Usage status**: "X of 3 generations left" or "Unlimited generations"
4. **Mode selector**: Dropdown with "Sermon" and "Bible Study"
5. **AI input box**: Large textarea with search button
6. **Example buttons**: "Example: Sermon" and "Example: Study"
7. **Dot pattern background**: Subtle pattern in the background

## 🧪 Test the Component Directly

To verify SimpleUI works, you can test it directly:

1. Create a test page: `app/test-simple-ui/page.js`
2. Add this code:
```javascript
'use client'
import SimpleUI from '@/components/ui/simple-ui'

export default function TestPage() {
  return <SimpleUI usageCount={1} isPro={false} userName="Test User" />
}
```

3. Visit `/test-simple-ui`
4. If it works here, the issue is in the dashboard integration

## 📝 Check These Files

### app/dashboard/page.js
Should have:
```javascript
import SimpleUI from '../../components/ui/simple-ui'
// ...
<SimpleUI
  usageCount={usageCount}
  isPro={subscriptionStatus}
  userName={userName}
/>
```

### components/ui/simple-ui.js
Should start with:
```javascript
'use client'
import { useState, useEffect } from 'react'
// ...
```

### lib/utils.js
Should have:
```javascript
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
export function cn(...inputs) { ... }
```

## 🚨 If Nothing Works

1. **Check terminal output** for build errors
2. **Check browser console** for runtime errors
3. **Verify all imports** are correct
4. **Try creating a minimal test** to isolate the issue

## 💡 Quick Test

Add this to `app/dashboard/page.js` temporarily to verify it's loading:

```javascript
return (
  <div>
    <h1>TEST: SimpleUI should be below</h1>
    <SimpleUI
      usageCount={usageCount}
      isPro={subscriptionStatus}
      userName={userName}
    />
  </div>
)
```

If you see "TEST: SimpleUI should be below" but not the SimpleUI component, there's an error in SimpleUI itself.

---

**Most common fix**: Hard refresh (`Ctrl+Shift+R`) after restarting the dev server! 🔄
