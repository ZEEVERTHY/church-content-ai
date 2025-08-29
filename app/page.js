export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">ChurchContentAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/auth" className="text-indigo-600 hover:text-indigo-800">Sign In</a>
              <a href="/auth" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Content Creation
            <span className="block text-indigo-600">for Church Leaders</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate inspiring sermons and Bible study outlines in minutes. 
            Let AI help you focus on what matters most - ministering to your congregation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="/auth" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-200 text-center">
              Start Creating Now
            </a>
          </div>
        </div>

        {/* Features Preview */}
        <div className="grid md:grid-cols-2 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Sermon Generator</h3>
            <p className="text-gray-600 mb-4">
              Create complete sermons from Bible verses or topics. Generate pastoral, relatable messages that connect with your congregation on a personal level.
            </p>
            <a href="/auth" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200">
              Try Sermon Generator
            </a>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Bible Study Generator</h3>
            <p className="text-gray-600 mb-4">
              Build structured Bible study outlines with discussion questions, practical applications, and interactive elements that engage your group.
            </p>
            <a href="/auth" className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200">
              Try Study Generator
            </a>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Focus on Ministry, Not Preparation</h3>
            <p className="text-lg text-gray-600 mb-6">
              ChurchContentAI helps pastors and church leaders create meaningful, biblically-grounded content quickly, 
              giving you more time for prayer, pastoral care, and connecting with your congregation.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">3</div>
                <p className="text-sm text-gray-600">Free creations to get started</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">15-30s</div>
                <p className="text-sm text-gray-600">Average generation time</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">∞</div>
                <p className="text-sm text-gray-600">Possibilities for your ministry</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Content Creation?</h3>
          <p className="text-gray-600 mb-6">Join church leaders who are already using AI to enhance their ministry.</p>
          <a href="/auth" className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-indigo-700 transform hover:scale-105 transition duration-200">
            Get Started Free
          </a>
        </div>
      </main>
    </div>
  )
}