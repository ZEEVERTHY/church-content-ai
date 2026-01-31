# 🔧 Fix Next.js Cache Error

## The Problem
You're seeing errors about missing `routes-manifest.json` in the `.next` folder. This happens when the Next.js build cache gets corrupted.

## ✅ Solution

### Step 1: Stop the Dev Server
**IMPORTANT**: The dev server must be stopped first!

1. Go to your terminal where `npm run dev` is running
2. Press `Ctrl + C` to stop it
3. Wait until it's fully stopped

### Step 2: Delete .next Folder

**Option A: Using PowerShell (Recommended)**
```powershell
# Make sure you're in the project directory
cd "d:\ideas\ai church content remaining stripe\MOST COMPLETE FUNCTIONING WEBSITE 261025\churchcontentai"

# Stop any Node processes that might be locking files
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Wait a moment
Start-Sleep -Seconds 2

# Delete .next folder
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue

# Verify it's deleted
if (Test-Path .next) {
    Write-Host "⚠️ Still exists, try manually deleting"
} else {
    Write-Host "✅ .next folder deleted successfully"
}
```

**Option B: Manual Delete**
1. Close all terminals/editors
2. Open File Explorer
3. Navigate to: `D:\ideas\ai church content remaining stripe\MOST COMPLETE FUNCTIONING WEBSITE 261025\churchcontentai`
4. Delete the `.next` folder manually
5. If it says "in use", restart your computer or close all Node processes

### Step 3: Restart Dev Server
```bash
npm run dev
```

The `.next` folder will be recreated automatically with fresh cache.

## 🚨 If Still Having Issues

### Check for Locked Files
```powershell
# Check what's locking .next folder
Get-Process | Where-Object {$_.Path -like "*node*"} | Stop-Process -Force
```

### Nuclear Option (If Nothing Works)
1. Close ALL applications (VS Code, terminals, browsers)
2. Restart your computer
3. Delete `.next` folder
4. Run `npm run dev`

## ✅ After Fixing

Once the server restarts successfully:
1. Go to `http://localhost:3000/dashboard`
2. Hard refresh: `Ctrl + Shift + R`
3. You should see the new SimpleUI dashboard

---

**The error is just a corrupted cache. Deleting `.next` and restarting will fix it!** 🔄
