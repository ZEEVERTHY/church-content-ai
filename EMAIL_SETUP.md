# Email Setup Guide for Feedback System

This guide will help you set up email functionality to receive user feedback and complaints.

## 🚀 Quick Setup Options

### Option 1: EmailJS (Recommended - Free & Easy)

1. **Sign up at [EmailJS](https://www.emailjs.com/)**
2. **Create an Email Service:**
   - Go to "Email Services" → "Add New Service"
   - Choose your email provider (Gmail, Outlook, etc.)
   - Follow the setup instructions

3. **Create an Email Template:**
   - Go to "Email Templates" → "Create New Template"
   - Use this template:

```html
Subject: [{{type}}] {{subject}}

From: {{from_name}} <{{from_email}}>
Type: {{type}}
Subject: {{subject}}

Message:
{{message}}

---
Reply to: {{reply_to}}
```

4. **Get your credentials:**
   - Service ID: From your email service
   - Template ID: From your email template
   - Public Key: From "Account" → "General"

5. **Add to Vercel Environment Variables:**
```
EMAIL_SERVICE_ID=your_service_id
EMAIL_TEMPLATE_ID=your_template_id
EMAIL_PUBLIC_KEY=your_public_key
FEEDBACK_EMAIL=your-email@example.com
```

### Option 2: Resend (Professional)

1. **Sign up at [Resend](https://resend.com/)**
2. **Get your API key**
3. **Update the API endpoint** to use Resend instead

### Option 3: Nodemailer with Gmail

1. **Enable 2FA on your Gmail account**
2. **Generate an App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"

3. **Add to Vercel Environment Variables:**
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
FEEDBACK_EMAIL=your-email@gmail.com
```

## 🔧 Environment Variables for Vercel

Add these to your Vercel project settings:

### For EmailJS:
```
EMAIL_SERVICE_ID=service_xxxxxxx
EMAIL_TEMPLATE_ID=template_xxxxxxx
EMAIL_PUBLIC_KEY=user_xxxxxxxxxxxxx
FEEDBACK_EMAIL=your-email@example.com
```

### For Gmail/Nodemailer:
```
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
FEEDBACK_EMAIL=your-email@gmail.com
```

## 📧 Email Template Variables

The feedback form sends these variables:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{type}}` - "feedback" or "complaint"
- `{{reply_to}}` - User's email for replies

## 🧪 Testing

1. **Deploy your changes to Vercel**
2. **Visit your app's feedback page**
3. **Submit a test message**
4. **Check your email inbox**

## 🚨 Troubleshooting

### Email not received?
1. Check Vercel environment variables are set correctly
2. Check your email service configuration
3. Look at Vercel function logs for errors
4. Test with a simple email first

### EmailJS not working?
1. Verify all three IDs are correct
2. Check your email service is active
3. Test the template in EmailJS dashboard

### Gmail not working?
1. Make sure 2FA is enabled
2. Use App Password, not regular password
3. Check Gmail security settings

## 📱 Mobile Responsive

The feedback form is fully mobile-responsive and includes:
- Touch-friendly form fields
- Responsive layout
- Mobile-optimized buttons
- Success/error states

## 🔒 Security Notes

- User emails are validated
- All fields are required
- Rate limiting can be added if needed
- Consider adding CAPTCHA for production

## 📊 Analytics (Optional)

You can track feedback submissions by:
1. Adding Google Analytics events
2. Logging to a database
3. Using a service like Mixpanel

## 🎯 Next Steps

1. Choose an email service
2. Set up the service
3. Add environment variables to Vercel
4. Test the feedback form
5. Monitor feedback emails

---

**Need help?** Check the logs in your Vercel dashboard or contact support.
