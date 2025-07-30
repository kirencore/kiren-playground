'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface ConsoleMessage {
  id: string
  type: 'log' | 'error' | 'warn' | 'info' | 'success'
  content: string
  timestamp: Date
}

interface ConsoleProps {
  messages: ConsoleMessage[]
  className?: string
}

export function Console({ messages, className }: ConsoleProps) {
  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [messages])

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400'
      case 'warn':
        return 'text-yellow-400'
      case 'success':
        return 'text-green-400'
      case 'info':
        return 'text-blue-400'
      default:
        return 'text-gray-300'
    }
  }

  const getMessagePrefix = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return '❌'
      case 'warn':
        return '⚠️'
      case 'success':
        return '✅'
      case 'info':
        return 'ℹ️'
      default:
        return '>'
    }
  }

  return (
    <div 
      ref={consoleRef}
      className={cn(
        "h-full w-full overflow-y-auto bg-gray-900 font-mono text-sm p-4 space-y-1",
        className
      )}
    >
      {messages.length === 0 ? (
        <div className="text-gray-500 italic">
          Console output will appear here...
        </div>
      ) : (
        messages.map((message) => (
          <div 
            key={message.id} 
            className="flex items-start gap-2 py-1"
          >
            <span className="text-gray-500 text-xs shrink-0 w-20">
              {message.timestamp.toLocaleTimeString()}
            </span>
            <span className="shrink-0">
              {getMessagePrefix(message.type)}
            </span>
            <pre className={cn(
              "whitespace-pre-wrap break-words",
              getMessageColor(message.type)
            )}>
              {message.content}
            </pre>
          </div>
        ))
      )}
    </div>
  )
}