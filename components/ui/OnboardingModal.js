'use client'
import { useState, useEffect } from 'react'

const OnboardingModal = ({ isOpen, onClose, user }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  const steps = [
    {
      title: "Welcome to ChurchContentAI!",
      content: "Let's take a quick tour to help you get started with your AI ministry assistant.",
      icon: "👋",
      action: "Get Started"
    },
    {
      title: "See It In Action",
      content: "Watch how Pastor Sarah creates her weekly sermon in just 5 minutes using our AI assistant.",
      icon: "🎬",
      action: "Watch Demo",
      video: true
    },
    {
      title: "Create Your First Content",
      content: "Ready to try it yourself? Let's create your first AI-assisted sermon or Bible study.",
      icon: "✨",
      action: "Start Creating"
    },
    {
      title: "You're All Set!",
      content: "You now have everything you need to enhance your ministry with AI assistance. Remember: AI supports your calling, it doesn't replace it.",
      icon: "🎉",
      action: "Start Creating"
    }
  ]

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0)
      setIsCompleted(false)
    }
  }, [isOpen])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleted(true)
      localStorage.setItem('onboardingCompleted', 'true')
      onClose()
    }
  }

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true')
    onClose()
  }

  if (!isOpen) return null

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl">{currentStepData.icon}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-indigo-100 text-sm">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-white hover:text-indigo-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
            <span className="ml-4 text-sm text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">{currentStepData.icon}</span>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              {currentStepData.content}
            </p>
          </div>

          {/* Video Demo for Step 2 */}
          {currentStep === 1 && currentStepData.video && (
            <div className="bg-gray-100 rounded-lg p-8 mb-6 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6a2 2 0 012-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Video</h3>
              <p className="text-gray-600 mb-4">See how easy it is to create powerful sermons</p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium">
                Play Demo
              </button>
            </div>
          )}

          {/* Quick Tips */}
          {currentStep === 2 && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Tips for Success</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Be Specific</h4>
                    <p className="text-blue-800 text-sm">Include your topic, Bible verse, and target audience</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Personalize</h4>
                    <p className="text-blue-800 text-sm">Always review and add your own insights</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Pray First</h4>
                    <p className="text-blue-800 text-sm">Seek the Holy Spirit&apos;s guidance before and after</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <span className="text-blue-600 text-sm">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900">Save & Organize</h4>
                    <p className="text-blue-800 text-sm">Use your Library to keep track of content</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
            >
              Skip Tour
            </button>
            <div className="flex space-x-3">
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
              >
                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal

