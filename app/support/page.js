'use client'
import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import BackButton from '../../components/ui/BackButton'

export default function Support() {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create my first sermon with ChurchContentAI?',
          answer: 'Simply go to the Generate Sermon page, enter your topic and Bible verse, choose your preaching style and length, then click "Generate Sermon". The AI will create a comprehensive outline that you can customize with your personal insights.'
        },
        {
          question: 'What information do I need to provide for sermon generation?',
          answer: 'You need to provide: 1) A sermon topic (required), 2) A Bible verse (optional but recommended), 3) Your preaching style (conversational, expository, topical, or narrative), and 4) The desired length (short, medium, or long).'
        },
        {
          question: 'How long does it take to generate content?',
          answer: 'Most content is generated within 30-60 seconds. Complex requests or longer content may take up to 2 minutes. You\'ll see a progress indicator during generation.'
        }
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          question: 'How does the free plan work?',
          answer: 'The free plan includes 3 content generations per month (sermons or Bible studies). These reset monthly, and you can upgrade to Premium anytime for unlimited generations.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards, debit cards, and bank transfers through Stripe. We also accept Nigerian bank transfers and mobile money payments.'
        },
        {
          question: 'Can I cancel my subscription anytime?',
          answer: 'Yes, you can cancel your subscription anytime from your dashboard. You\'ll continue to have access to premium features until the end of your current billing period.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day money-back guarantee for all new subscribers. If you\'re not satisfied, contact our support team for a full refund.'
        }
      ]
    },
    {
      category: 'Content & Features',
      questions: [
        {
          question: 'Is the AI-generated content Biblically accurate?',
          answer: 'Yes, our AI is trained on Biblically sound content and reviewed by ministry professionals. However, we always recommend that pastors review, pray over, and personalize the content with their own insights and the Holy Spirit\'s guidance.'
        },
        {
          question: 'Can I save and organize my generated content?',
          answer: 'Yes! All your generated content is automatically saved to your Library, where you can organize, search, copy, and download your sermons and Bible studies.'
        },
        {
          question: 'Can I edit the AI-generated content?',
          answer: 'Absolutely! The AI provides a foundation - you should always review, edit, and personalize the content with your own experiences, insights, and pastoral wisdom.'
        },
        {
          question: 'What types of content can I generate?',
          answer: 'You can generate sermon outlines, Bible study guides, and various ministry resources. We\'re constantly adding new content types based on pastor feedback.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'What if I forget my password?',
          answer: 'Since we use Google OAuth, you don\'t need to remember a separate password. Simply click "Sign in with Google" and use your Google account credentials.'
        },
        {
          question: 'Is my data secure?',
          answer: 'Yes, we use enterprise-grade security measures including SSL encryption, secure data storage, and comply with international data protection standards. Your content is private and never shared.'
        },
        {
          question: 'Can I use ChurchContentAI on my mobile device?',
          answer: 'Yes! ChurchContentAI is fully responsive and works great on mobile devices. You can even install it as a Progressive Web App (PWA) for a native app experience.'
        },
        {
          question: 'What if I encounter technical issues?',
          answer: 'Contact our support team through the feedback form or email support@churchcontentai.com. We typically respond within 24 hours and offer priority support for premium users.'
        }
      ]
    }
  ]

  const tutorials = [
    {
      title: 'Getting Started with Sermon Generation',
      description: 'Learn how to create your first AI-assisted sermon in under 5 minutes.',
      duration: '5 min',
      difficulty: 'Beginner',
      type: 'Video'
    },
    {
      title: 'Creating Engaging Bible Studies',
      description: 'Master the art of creating interactive Bible study guides that engage your congregation.',
      duration: '8 min',
      difficulty: 'Intermediate',
      type: 'Video'
    },
    {
      title: 'Organizing Your Content Library',
      description: 'Learn how to effectively organize, search, and manage your generated content.',
      duration: '6 min',
      difficulty: 'Beginner',
      type: 'Guide'
    },
    {
      title: 'Customizing AI-Generated Content',
      description: 'Discover how to personalize AI content with your unique pastoral voice and insights.',
      duration: '10 min',
      difficulty: 'Advanced',
      type: 'Video'
    }
  ]

  const contactMethods = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      contact: 'support@churchcontentai.com',
      icon: '📧',
      responseTime: '24 hours'
    },
    {
      title: 'Feedback Form',
      description: 'Submit feedback, bug reports, or feature requests',
      contact: 'Use the feedback form in your dashboard',
      icon: '💬',
      responseTime: '48 hours'
    },
    {
      title: 'Priority Support',
      description: 'Premium users get priority support',
      contact: 'Available in your dashboard',
      icon: '⭐',
      responseTime: '12 hours'
    }
  ]

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <Layout>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <BackButton href="/" className="mb-4">
            ← Back to Home
          </BackButton>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Support Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get help, learn best practices, and make the most of your ChurchContentAI experience
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles, tutorials, or FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12">
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'faq'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            FAQ
          </button>
          <button
            onClick={() => setActiveTab('tutorials')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'tutorials'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutorials
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`px-6 py-3 rounded-lg font-medium transition duration-200 ${
              activeTab === 'contact'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Contact Us
          </button>
        </div>

        {/* FAQ Section */}
        {activeTab === 'faq' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              <div className="space-y-8">
                {filteredFaqs.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      {category.category}
                    </h3>
                    <div className="space-y-6">
                      {category.questions.map((faq, faqIndex) => (
                        <div key={faqIndex} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {faq.question}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tutorials Section */}
        {activeTab === 'tutorials' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Learning Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tutorials.map((tutorial, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        {tutorial.type}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {tutorial.difficulty}
                      </span>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {tutorial.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {tutorial.description}
                  </p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition duration-200">
                    Start Learning
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeTab === 'contact' && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100">
                  <div className="text-4xl mb-4">{method.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {method.description}
                  </p>
                  <p className="text-indigo-600 font-medium mb-2">
                    {method.contact}
                  </p>
                  <p className="text-sm text-gray-500">
                    Response time: {method.responseTime}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Still Need Help?
              </h3>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you succeed in your ministry.
              </p>
              <a
                href="/feedback"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-medium transition duration-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Quick Links
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a href="/auth" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-medium text-gray-900">Get Started</div>
            </a>
            <a href="/pricing" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">💰</div>
              <div className="font-medium text-gray-900">View Pricing</div>
            </a>
            <a href="/testimonials" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">⭐</div>
              <div className="font-medium text-gray-900">Success Stories</div>
            </a>
            <a href="/about" className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
              <div className="text-2xl mb-2">ℹ️</div>
              <div className="font-medium text-gray-900">About Us</div>
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}

