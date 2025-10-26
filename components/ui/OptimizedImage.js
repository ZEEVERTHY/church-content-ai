'use client'
import Image from 'next/image'
import { useDataSaver } from './DataSaverMode'

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  placeholder = 'blur',
  blurDataURL,
  ...props
}) => {
  const { shouldReduceImages, isDataSaverEnabled } = useDataSaver()

  // In data saver mode, use lower quality
  const quality = shouldReduceImages ? 50 : 75
  const sizes = shouldReduceImages 
    ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
    : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'

  // Generate blur placeholder if not provided
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      quality={quality}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL || defaultBlurDataURL}
      sizes={sizes}
      className={`transition-opacity duration-300 ${className}`}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
      {...props}
    />
  )
}

export default OptimizedImage




