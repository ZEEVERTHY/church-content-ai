'use client'

import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import { BlurFade } from './blur-fade'
import { cn } from '@/lib/utils'

export function LimitModal({ isOpen, onClose }) {
  const router = useRouter()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <BlurFade>
        <div className="border rounded-lg shadow-lg max-w-md w-full p-6 relative" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            onMouseEnter={(e) => e.target.style.color = 'var(--foreground)'}
            onMouseLeave={(e) => e.target.style.color = 'var(--muted-foreground)'}
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
                You&apos;ve reached your free limit
              </h3>
              <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
                Free accounts can generate up to 3 sermons or studies per month.
                Upgrade to Premium to continue creating without limits.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:opacity-80"
                style={{ 
                  borderColor: 'var(--border)', 
                  backgroundColor: 'var(--background)',
                  color: 'var(--foreground)'
                }}
              >
                Maybe Later
              </button>
              <button
                onClick={() => {
                  router.push('/pricing')
                  onClose()
                }}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)'
                }}
              >
                Upgrade to Unlimited
              </button>
            </div>
          </div>
        </div>
      </BlurFade>
    </div>
  )
}
