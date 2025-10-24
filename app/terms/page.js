'use client'
import Layout from '../../components/layout/Layout'
import BackButton from '../../components/ui/BackButton'

export default function Terms() {
  return (
    <Layout>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton href="/" className="mb-4">
            ← Back to Home
          </BackButton>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-green-900 mb-2">Agreement Summary</h2>
            <p className="text-green-800">
              By using ChurchContentAI, you agree to these terms. We've made them as clear and 
              fair as possible. If you have questions, please contact us.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            
            <p className="text-gray-700 mb-4">
              By accessing or using ChurchContentAI ("the Service"), you agree to be bound by these 
              Terms of Service ("Terms"). If you disagree with any part of these terms, you may not 
              access the Service.
            </p>
            
            <p className="text-gray-700">
              These Terms apply to all visitors, users, and others who access or use the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Service</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">What We Provide</h3>
              <ul className="list-disc pl-4 text-gray-700 space-y-1">
                <li>AI-powered sermon generation and outlines</li>
                <li>Bible study guide creation</li>
                <li>Content library and organization tools</li>
                <li>Ministry-focused AI assistance</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Notice</h3>
              <p className="text-yellow-800">
                ChurchContentAI is designed to assist pastors, not replace them. All AI-generated 
                content should be reviewed, prayed over, and personalized with your own insights, 
                experiences, and the Holy Spirit's guidance before use in ministry.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Creation</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>You must provide accurate and complete information</li>
              <li>You are responsible for maintaining account security</li>
              <li>You must be at least 18 years old to use the Service</li>
              <li>One account per person or organization</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Responsibilities</h3>
            <ul className="list-disc pl-6 text-gray-700">
              <li>Keep your login credentials secure</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>You are responsible for all activities under your account</li>
              <li>Maintain accurate and current information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Acceptable Use</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">✅ Permitted Uses</h3>
                <ul className="list-disc pl-4 text-green-800 space-y-1">
                  <li>Generate sermons for your ministry</li>
                  <li>Create Bible study materials</li>
                  <li>Organize and manage content</li>
                  <li>Share content within your church</li>
                  <li>Use for personal spiritual growth</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-900 mb-3">❌ Prohibited Uses</h3>
                <ul className="list-disc pl-4 text-red-800 space-y-1">
                  <li>Resell or redistribute our service</li>
                  <li>Use for commercial purposes outside ministry</li>
                  <li>Attempt to reverse engineer our AI</li>
                  <li>Violate any applicable laws</li>
                  <li>Generate inappropriate or harmful content</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Content and Intellectual Property</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Content</h3>
            <p className="text-gray-700 mb-4">
              You retain ownership of all content you create using our Service. You grant us a 
              limited license to process your content to provide the Service and improve our AI models.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Service</h3>
            <p className="text-gray-700 mb-4">
              The Service, including all software, algorithms, and content, is owned by ChurchContentAI 
              and protected by intellectual property laws.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">AI-Generated Content</h3>
              <p className="text-blue-800">
                AI-generated content is provided as a starting point for your ministry. You are 
                responsible for reviewing, editing, and ensuring the theological accuracy and 
                appropriateness of all content before use.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payment and Billing</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Pricing</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Free plan: 3 generations per month</li>
              <li>Premium plan: ₦5,000/month for unlimited generations</li>
              <li>All prices are in Nigerian Naira (NGN)</li>
              <li>Prices may change with 30 days notice</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Billing Terms</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-4">
              <li>Subscriptions auto-renew unless cancelled</li>
              <li>Payment is due in advance</li>
              <li>No refunds for partial months</li>
              <li>30-day money-back guarantee for new subscribers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Cancellation</h3>
            <p className="text-gray-700">
              You may cancel your subscription at any time from your dashboard. Your access to 
              premium features will continue until the end of your current billing period.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Privacy and Data Protection</h2>
            
            <p className="text-gray-700 mb-4">
              Your privacy is important to us. Please review our Privacy Policy, which explains 
              how we collect, use, and protect your information.
            </p>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Security</h3>
              <ul className="list-disc pl-4 text-gray-700 space-y-1">
                <li>We use industry-standard security measures</li>
                <li>Your content is encrypted and secure</li>
                <li>We never sell your personal information</li>
                <li>You can delete your data at any time</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers and Limitations</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">Service Availability</h3>
              <p className="text-yellow-800">
                We strive to provide reliable service, but we cannot guarantee 100% uptime. 
                We may temporarily suspend service for maintenance or updates.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Content Accuracy</h3>
            <p className="text-gray-700 mb-4">
              While we strive for theological accuracy, AI-generated content should always be 
              reviewed by qualified ministry professionals. We are not responsible for the 
              theological accuracy or appropriateness of generated content.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
            <p className="text-gray-700">
              To the maximum extent permitted by law, ChurchContentAI shall not be liable for 
              any indirect, incidental, special, consequential, or punitive damages resulting 
              from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Your Rights</h3>
            <p className="text-gray-700 mb-4">
              You may terminate your account at any time by contacting us or using the account 
              deletion feature in your dashboard.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Rights</h3>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your account immediately, without prior notice, for 
              conduct that we believe violates these Terms or is harmful to other users or our Service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Effect of Termination</h3>
            <p className="text-gray-700">
              Upon termination, your right to use the Service will cease immediately. You may 
              request a copy of your data before account deletion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to Terms</h2>
            
            <p className="text-gray-700 mb-4">
              We reserve the right to modify these Terms at any time. We will notify users of 
              any material changes via email or through the Service. Your continued use of the 
              Service after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            
            <p className="text-gray-700">
              These Terms shall be governed by and construed in accordance with the laws of 
              Nigeria, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Information</h2>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-indigo-800 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-disc pl-4 text-indigo-800 space-y-1">
                <li><strong>Email:</strong> legal@churchcontentai.com</li>
                <li><strong>Support:</strong> support@churchcontentai.com</li>
                <li><strong>Feedback Form:</strong> Available in your dashboard</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  )
}

