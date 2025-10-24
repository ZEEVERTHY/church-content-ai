'use client'

const Button = ({
  children,
  onClick,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 py-3 text-sm min-h-[44px]',
    lg: 'px-6 py-4 text-base min-h-[48px]',
    xl: 'px-8 py-5 text-lg min-h-[52px]',
  }
  
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-gray-300',
    outline: 'bg-transparent hover:bg-indigo-50 text-indigo-600 border-indigo-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
  }
  
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button


