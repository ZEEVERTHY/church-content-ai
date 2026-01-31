'use client'

import * as React from 'react'
import { Send, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Textarea } from './textarea'
import { Button } from '@/components/ui/button'
import { useTextareaResize } from '@/hooks/use-textarea-resize'

// Context for ChatInput
const ChatInputContext = React.createContext({
  value: '',
  onChange: () => {},
  onSubmit: () => {},
  loading: false,
  onStop: () => {},
})

// Main ChatInput wrapper component
const ChatInput = React.forwardRef(
  ({ 
    className, 
    value, 
    onChange, 
    onSubmit, 
    loading = false,
    onStop,
    children,
    ...props 
  }, ref) => {
    const handleSubmit = (e) => {
      e?.preventDefault()
      if (value?.trim() && !loading) {
        onSubmit?.(value)
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e)
      }
    }

    return (
      <ChatInputContext.Provider
        value={{
          value,
          onChange,
          onSubmit: handleSubmit,
          loading,
          onStop,
          handleKeyDown,
        }}
      >
        <form
          ref={ref}
          onSubmit={handleSubmit}
          className={cn(
            'relative flex w-full items-end gap-2 rounded-lg border bg-background p-2 shadow-sm',
            'focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            className
          )}
          suppressHydrationWarning
          {...props}
        >
          {children}
        </form>
      </ChatInputContext.Provider>
    )
  }
)
ChatInput.displayName = 'ChatInput'

// ChatInputTextArea component
const ChatInputTextArea = React.forwardRef(
  ({ className, placeholder, disabled, ...props }, ref) => {
    const { value, onChange, handleKeyDown, loading } = React.useContext(ChatInputContext)
    const { textareaRef, adjustHeight } = useTextareaResize({ minHeight: 48, maxHeight: 400 })
    
    // Use the ref from hook or forwarded ref
    React.useImperativeHandle(ref, () => textareaRef.current, [textareaRef])

    React.useEffect(() => {
      adjustHeight()
    }, [value, adjustHeight])

    return (
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          onChange?.(e)
          adjustHeight()
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={loading || disabled}
        className={cn(
          'min-h-[48px] max-h-[400px] resize-none border-0 bg-transparent px-3 py-2',
          'focus-visible:ring-0 focus-visible:ring-offset-0',
          className
        )}
        {...props}
      />
    )
  }
)
ChatInputTextArea.displayName = 'ChatInputTextArea'

// ChatInputSubmit component
const ChatInputSubmit = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { value, onSubmit, loading, onStop } = React.useContext(ChatInputContext)
    const hasValue = value?.trim().length > 0

    if (loading) {
      return (
        <Button
          ref={ref}
          type="button"
          variant="ghost"
          size="icon"
          onClick={onStop}
          className={cn('h-8 w-8 shrink-0', className)}
          {...props}
        >
          <Square className="h-4 w-4" />
          <span className="sr-only">Stop</span>
        </Button>
      )
    }

    return (
      <Button
        ref={ref}
        type="submit"
        variant="ghost"
        size="icon"
        disabled={!hasValue}
        className={cn('h-8 w-8 shrink-0', className)}
        {...props}
      >
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    )
  }
)
ChatInputSubmit.displayName = 'ChatInputSubmit'


export { ChatInput, ChatInputTextArea, ChatInputSubmit }
