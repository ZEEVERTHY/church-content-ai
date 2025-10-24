'use client'

const SkeletonLoader = ({
  className = '',
  shape = 'rect',
  size = 'md',
  height,
  width,
  ...props
}) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  const shapeClasses = {
    rect: 'rounded',
    circle: 'rounded-full',
    text: 'rounded-sm',
  }
  
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-6', 
    lg: 'h-8',
    xl: 'h-12',
  }
  
  const classes = `${baseClasses} ${shapeClasses[shape]} ${sizeClasses[size]} ${className}`
  
  return (
    <div
      className={classes}
      style={{
        height: height || undefined,
        width: width || undefined,
      }}
      {...props}
    />
  )
}

// Pre-built skeleton components for common patterns
export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="flex items-center space-x-4 mb-4">
      <SkeletonLoader shape="circle" size="lg" width="48px" height="48px" />
      <div className="space-y-2 flex-1">
        <SkeletonLoader width="60%" height="20px" />
        <SkeletonLoader width="40%" height="16px" />
      </div>
    </div>
    <div className="space-y-3">
      <SkeletonLoader width="100%" height="16px" />
      <SkeletonLoader width="80%" height="16px" />
      <SkeletonLoader width="90%" height="16px" />
    </div>
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="text-center">
      <SkeletonLoader width="300px" height="40px" className="mx-auto mb-4" />
      <SkeletonLoader width="400px" height="24px" className="mx-auto" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CardSkeleton />
      <CardSkeleton />
    </div>
    
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <SkeletonLoader width="200px" height="24px" className="mb-4" />
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <SkeletonLoader width="60px" height="32px" className="mx-auto mb-2" />
          <SkeletonLoader width="120px" height="16px" className="mx-auto" />
        </div>
        <div className="text-center">
          <SkeletonLoader width="60px" height="32px" className="mx-auto mb-2" />
          <SkeletonLoader width="120px" height="16px" className="mx-auto" />
        </div>
        <div className="text-center">
          <SkeletonLoader width="60px" height="32px" className="mx-auto mb-2" />
          <SkeletonLoader width="120px" height="16px" className="mx-auto" />
        </div>
      </div>
    </div>
  </div>
)

export const FormSkeleton = () => (
  <div className="bg-white rounded-lg shadow p-6 animate-pulse">
    <div className="space-y-6">
      <div>
        <SkeletonLoader width="120px" height="16px" className="mb-2" />
        <SkeletonLoader width="100%" height="40px" />
      </div>
      <div>
        <SkeletonLoader width="100px" height="16px" className="mb-2" />
        <SkeletonLoader width="100%" height="40px" />
      </div>
      <div>
        <SkeletonLoader width="80px" height="16px" className="mb-2" />
        <SkeletonLoader width="100%" height="100px" />
      </div>
      <SkeletonLoader width="100%" height="44px" />
    </div>
  </div>
)

export default SkeletonLoader
