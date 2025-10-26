'use client'

const Card = ({ children, className = '', ...props }) => {
  const baseClasses = 'bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'
  const classes = `${baseClasses} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardHeader = ({ children, className = '', ...props }) => {
  const baseClasses = 'px-6 py-4 border-b border-gray-200'
  const classes = `${baseClasses} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardContent = ({ children, className = '', ...props }) => {
  const baseClasses = 'px-6 py-4'
  const classes = `${baseClasses} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardFooter = ({ children, className = '', ...props }) => {
  const baseClasses = 'px-6 py-4 border-t border-gray-200 bg-gray-50'
  const classes = `${baseClasses} ${className}`
  
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}

const CardTitle = ({ children, className = '', ...props }) => {
  const baseClasses = 'text-lg font-semibold text-gray-900'
  const classes = `${baseClasses} ${className}`
  
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  )
}

const CardDescription = ({ children, className = '', ...props }) => {
  const baseClasses = 'text-sm text-gray-600'
  const classes = `${baseClasses} ${className}`
  
  return (
    <p className={classes} {...props}>
      {children}
    </p>
  )
}

// Attach sub-components to the main Card component
Card.Header = CardHeader
Card.Content = CardContent
Card.Footer = CardFooter
Card.Title = CardTitle
Card.Description = CardDescription

export default Card




