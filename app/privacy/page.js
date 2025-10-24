'use client'
import Layout from '../../components/layout/Layout'
import BackButton from '../../components/ui/BackButton'

export default function Privacy() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">Quick Summary</h2>
            <p className="text-blue-800">
              We respect your privacy and are committed to protecting your personal information. 
              We only collect what&apos;s necessary to provide our service, never sell your data, 
              and give you full control over your information.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Account Information:</strong> Email address, name (from Google OAuth)</li>
              <li><strong>Usage Data:</strong> Content you generate, features you use, time spent on platform</li>
              <li><strong>Payment Information:</strong> Billing details (processed securely through Stripe)</li>
              <li><strong>Communication:</strong> Messages you send through our feedback system</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Technical Information</h3>
            <ul className="list-disc pl-6 mb-4 text-gray-700">
              <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
              <li><strong>Usage Analytics:</strong> Pages visited, features used, performance metrics</li>
              <li><strong>Cookies:</strong> Essential cookies for functionality and optional analytics</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Provision</h3>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>Generate AI-powered content</li>
                  <li>Save and organize your content</li>
                  <li>Track usage limits</li>
                  <li>Process payments</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Service Improvement</h3>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>Analyze usage patterns</li>
                  <li>Improve AI accuracy</li>
                  <li>Develop new features</li>
                  <li>Optimize performance</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Security</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">Security Measures</h3>
              <ul className="list-disc pl-4 text-green-800 space-y-1">
                <li><strong>Encryption:</strong> All data encrypted in transit and at rest</li>
                <li><strong>Access Controls:</strong> Strict access controls and authentication</li>
                <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
                <li><strong>Secure Infrastructure:</strong> Enterprise-grade hosting and security</li>
              </ul>
            </div>

            <p className="text-gray-700 mb-4">
              We implement industry-standard security measures to protect your personal information. 
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">We DO NOT:</h3>
              <ul className="list-disc pl-4 text-yellow-800 space-y-1">
                <li>Sell your personal information to third parties</li>
                <li>Share your content with other users</li>
                <li>Use your data for advertising purposes</li>
                <li>Share your information without your consent</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Limited Sharing</h3>
            <p className="text-gray-700 mb-4">
              We may share your information only in these limited circumstances:
            </p>
            <ul className="list-disc pl-6 text-gray-700">
              <li><strong>Service Providers:</strong> Trusted third parties who help us operate our service (e.g., Stripe for payments, OpenAI for AI processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In case of merger or acquisition (with notice)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Access & Control</h3>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>View your personal data</li>
                  <li>Update your information</li>
                  <li>Download your content</li>
                  <li>Delete your account</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Privacy Controls</h3>
                <ul className="list-disc pl-4 text-gray-700 space-y-1">
                  <li>Opt out of analytics</li>
                  <li>Control cookie preferences</li>
                  <li>Manage notification settings</li>
                  <li>Request data deletion</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">How Long We Keep Your Data</h3>
              <ul className="list-disc pl-4 text-gray-700 space-y-2">
                <li><strong>Account Information:</strong> Until you delete your account</li>
                <li><strong>Generated Content:</strong> Until you delete it or your account</li>
                <li><strong>Usage Data:</strong> Up to 2 years for service improvement</li>
                <li><strong>Payment Records:</strong> As required by law (typically 7 years)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. International Users</h2>
            
            <p className="text-gray-700 mb-4">
              If you&apos;re accessing our service from outside Nigeria, please note that your information 
              may be transferred to, stored, and processed in Nigeria where our servers are located.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">GDPR Compliance</h3>
              <p className="text-blue-800 mb-3">
                For users in the European Union, we comply with GDPR requirements:
              </p>
              <ul className="list-disc pl-4 text-blue-800 space-y-1">
                <li>Right to access your personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure (&ldquo;right to be forgotten&rdquo;)</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children&apos;s Privacy</h2>
            
            <p className="text-gray-700">
              Our service is not intended for children under 13. We do not knowingly collect 
              personal information from children under 13. If we become aware that we have 
              collected personal information from a child under 13, we will take steps to 
              delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Policy</h2>
            
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the &ldquo;Last updated&rdquo; 
              date. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
              <p className="text-indigo-800 mb-4">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <ul className="list-disc pl-4 text-indigo-800 space-y-1">
                <li><strong>Email:</strong> privacy@churchcontentai.com</li>
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

