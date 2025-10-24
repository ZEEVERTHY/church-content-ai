'use client'
import Layout from '../../components/layout/Layout'
import BackButton from '../../components/ui/BackButton'

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Pastor David Thompson",
      church: "Grace Community Church, Lagos",
      location: "Lagos, Nigeria",
      image: "/testimonials/pastor-david.jpg",
      quote: "ChurchContentAI has revolutionized my sermon preparation. What used to take me 8-10 hours now takes 2-3 hours, giving me more time for pastoral care and prayer. The AI suggestions are always Biblically sound and help me think through topics from fresh angles.",
      results: "Saves 6+ hours weekly",
      rating: 5
    },
    {
      id: 2,
      name: "Rev. Sarah Adebayo",
      church: "Victory Baptist Church",
      location: "Abuja, Nigeria",
      image: "/testimonials/pastor-sarah.jpg",
      quote: "As a bi-vocational pastor, time is my most precious resource. ChurchContentAI helps me prepare quality sermons and Bible studies without sacrificing my family time or secular job. The content is always theologically sound and culturally relevant.",
      results: "Balances ministry and family",
      rating: 5
    },
    {
      id: 3,
      name: "Pastor Michael Okafor",
      church: "New Life Pentecostal Church",
      location: "Port Harcourt, Nigeria",
      image: "/testimonials/pastor-michael.jpg",
      quote: "I was skeptical about AI in ministry, but ChurchContentAI respects the pastoral calling. It's like having a research assistant who understands theology. My congregation has noticed the improvement in my preaching, and I feel more confident in my preparation.",
      results: "Enhanced preaching confidence",
      rating: 5
    },
    {
      id: 4,
      name: "Rev. Grace Williams",
      church: "First Methodist Church",
      location: "Ibadan, Nigeria",
      image: "/testimonials/pastor-grace.jpg",
      quote: "The Bible study outlines are incredible. They're structured, engaging, and help me create meaningful discussions. My small groups have grown deeper in their faith, and I've been able to start new study groups because preparation is so much easier.",
      results: "Expanded ministry reach",
      rating: 5
    },
    {
      id: 5,
      name: "Pastor James Okonkwo",
      church: "Living Word Assembly",
      location: "Enugu, Nigeria",
      image: "/testimonials/pastor-james.jpg",
      quote: "What I love most is how ChurchContentAI maintains the personal touch in ministry. It doesn't replace my voice or calling - it amplifies it. The AI helps me organize my thoughts and find fresh illustrations while keeping my unique pastoral perspective.",
      results: "Amplified pastoral voice",
      rating: 5
    },
    {
      id: 6,
      name: "Rev. Mary Johnson",
      church: "Christ Redeemer Church",
      location: "Kano, Nigeria",
      image: "/testimonials/pastor-mary.jpg",
      quote: "As a female pastor, I sometimes struggle with finding my voice in a male-dominated field. ChurchContentAI helps me prepare sermons that are both Biblically strong and authentically me. It's like having a mentor who understands my unique calling.",
      results: "Strengthened pastoral identity",
      rating: 5
    }
  ]

  const stats = [
    { number: "500+", label: "Active Pastors" },
    { number: "10,000+", label: "Sermons Created" },
    { number: "5,000+", label: "Bible Studies Generated" },
    { number: "95%", label: "User Satisfaction" }
  ]

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
            What Pastors Are Saying
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real stories from real pastors who are transforming their ministry with AI assistance
          </p>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>

                {/* Results Badge */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-green-800 font-medium text-sm">
                      {testimonial.results}
                    </span>
                  </div>
                </div>

                {/* Author */}
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.church}
                    </div>
                    <div className="text-sm text-indigo-600">
                      {testimonial.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Testimonials Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Watch Pastors Share Their Experience
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pastor David's Story
              </h3>
              <p className="text-gray-600 mb-4">
                See how Pastor David transformed his sermon preparation and gained 6+ hours weekly for pastoral care.
              </p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium transition duration-200">
                Watch Video
              </button>
            </div>

            <div className="bg-gray-100 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rev. Sarah's Journey
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how Rev. Sarah balances bi-vocational ministry with quality sermon preparation.
              </p>
              <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition duration-200">
                Watch Video
              </button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Ministry?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of pastors who are already saving time and enhancing their ministry with AI assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-gray-100 font-medium transition duration-200"
            >
              Start Free Trial
            </a>
            <a
              href="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-indigo-600 font-medium transition duration-200"
            >
              View Pricing
            </a>
          </div>
        </div>
      </main>
    </Layout>
  )
}

