# 🔐 Customize Google OAuth Branding

This guide will help you change the Supabase URL shown in the Google sign-in screen to your website name/URL.

## The Problem

When users sign in with Google, they see:
> "You're signing back in to **eatkhvrwpbcmtwbphuom.supabase.co**"

You want them to see your website name instead.

## Solution Options

### Option 1: Configure OAuth Consent Screen (Recommended - Free)

This changes what Google shows in the consent screen, but the redirect URL will still be Supabase's domain.

**Steps:**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project (or create one if you don't have one)

2. **Navigate to OAuth Consent Screen**
   - Go to **APIs & Services** > **OAuth consent screen**
   - Or direct link: https://console.cloud.google.com/apis/credentials/consent

3. **Configure Your App Information**
   - **App name**: Enter "ChurchContentAI" (or your preferred name)
   - **User support email**: Your email
   - **App logo**: Upload your logo (optional but recommended)
   - **App domain**: Your website domain (e.g., `churchcontentai.com`)
   - **Developer contact information**: Your email

4. **Add Scopes** (if not already added)
   - Click **Add or Remove Scopes**
   - Add: `email`, `profile`, `openid`
   - Save

5. **Add Test Users** (if app is in testing mode)
   - Add your email and any test user emails
   - Once verified, you can publish the app

6. **Publish Your App** (when ready)
   - Click **Publish App**
   - This makes it available to all users

**Note**: This changes the app name shown, but Google may still show the redirect domain. For full control, see Option 2.

---

### Option 2: Use Custom Domain (Advanced - Requires Supabase Pro Plan)

If you have Supabase Pro plan, you can set up a custom domain for authentication.

**Steps:**

1. **In Supabase Dashboard**
   - Go to **Settings** > **Auth** > **URL Configuration**
   - Add your custom domain (e.g., `auth.churchcontentai.com`)

2. **Update DNS Records**
   - Add a CNAME record pointing to Supabase's auth domain
   - Supabase will provide the exact DNS configuration

3. **Update Your Code**
   - Update redirect URLs to use your custom domain
   - Update environment variables

**Note**: This requires a paid Supabase plan and DNS configuration.

---

### Option 3: Update OAuth Redirect URL in Code (Partial Solution)

You can customize the redirect URL shown, but it must still point to a valid Supabase endpoint.

**Update `app/auth/page.js`:**

```javascript
const handleGoogleSignIn = async () => {
  setLoading(true)
  
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Use your production URL
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        // Add custom branding
        skipBrowserRedirect: false,
      },
    })

    if (error) {
      console.error('Google sign in error:', error)
      setLoading(false)
    }
  } catch (error) {
    console.error('Sign in error:', error)
    setLoading(false)
  }
}
```

---

### Option 4: Use Your Own OAuth Implementation (Most Control)

For complete control, you can implement Google OAuth directly without Supabase's OAuth flow, but this requires more setup.

---

## Recommended Approach

**For most users, use Option 1** (OAuth Consent Screen configuration):

1. ✅ Free
2. ✅ Easy to set up
3. ✅ Changes the app name users see
4. ✅ Professional appearance

The redirect URL will still show Supabase's domain, but the app name will be your brand name.

## Step-by-Step: Configure Google OAuth Consent Screen

### 1. Find Your Google Cloud Project

1. Go to https://console.cloud.google.com/
2. Check if you have a project linked to your Supabase Google OAuth
3. If not, you may need to:
   - Check Supabase dashboard > Authentication > Providers > Google
   - See which Google Cloud project is being used
   - Or create a new OAuth client in Google Cloud Console

### 2. Configure OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** > **OAuth consent screen**
2. Choose **External** (unless you have a Google Workspace)
3. Fill in:
   - **App name**: `ChurchContentAI`
   - **User support email**: Your email
   - **App logo**: Upload a 120x120px logo
   - **App domain**: `churchcontentai.com` (or your domain)
   - **Application home page**: `https://churchcontentai.com`
   - **Privacy policy link**: `https://churchcontentai.com/privacy`
   - **Terms of service link**: `https://churchcontentai.com/terms`
   - **Authorized domains**: Add your domain

### 3. Add Scopes

1. Click **Add or Remove Scopes**
2. Add these scopes:
   - `email`
   - `profile`
   - `openid`
3. Save

### 4. Add Test Users (if in testing mode)

1. Add your email and test emails
2. These users can sign in while app is in testing

### 5. Publish (when ready for production)

1. Click **Publish App**
2. This makes it available to all users

## Update Supabase Configuration

1. **In Supabase Dashboard**
   - Go to **Authentication** > **Providers** > **Google**
   - Verify your Google OAuth client ID and secret are correct
   - Make sure redirect URLs match

2. **Authorized Redirect URIs in Google Cloud Console**
   - Go to **APIs & Services** > **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, ensure you have:
     - `https://eatkhvrwpbcmtwbphuom.supabase.co/auth/v1/callback`
     - `https://yourdomain.com/auth/v1/callback` (if using custom domain)

## Testing

1. Clear browser cache and cookies
2. Try signing in with Google
3. You should see your app name instead of just the Supabase URL
4. The consent screen should show your branding

## Troubleshooting

### Still seeing Supabase URL?

- Make sure you've published the OAuth consent screen
- Clear browser cache
- Try in incognito mode
- Verify the Google Cloud project matches the one used in Supabase

### OAuth not working?

- Check that redirect URIs match in both Supabase and Google Cloud Console
- Verify OAuth client ID and secret are correct
- Check browser console for errors

### Need more control?

- Consider Supabase Pro plan for custom domain
- Or implement your own OAuth flow (more complex)

## Additional Resources

- [Google OAuth Consent Screen Docs](https://developers.google.com/identity/protocols/oauth2/web-server#creatingcred)
- [Supabase Auth Custom Domains](https://supabase.com/docs/guides/auth/auth-deep-dive/auth-deep-dive-jwts#custom-domains)
- [Supabase Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

**Note**: The redirect URL domain (Supabase's domain) may still appear in some places, but the app name and branding will be yours. For complete domain control, you'll need a Supabase Pro plan with custom domain support.

