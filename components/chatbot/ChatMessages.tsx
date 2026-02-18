// components/chatbot/ChatMessages.tsx
'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

import { SimplePropertyCard } from './SimplePropertyCard'
import { ChatMessage, QuickReply } from './types'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isTyping: boolean
  quickReplies: QuickReply[]
  onQuickReply: (action: () => void) => void
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g

function renderMessageWithLinks(text: string) {
  const lines = text.split('\n')
  return lines.map((line, lineIndex) => {
    const parts = line.split(URL_REGEX)
    return (
      <span key={`line-${lineIndex}`}>
        {parts.map((part, partIndex) => {
          const isUrl = /^https?:\/\//.test(part)
          if (!isUrl) {
            return <span key={`part-${lineIndex}-${partIndex}`}>{part}</span>
          }
          return (
            <a
              key={`part-${lineIndex}-${partIndex}`}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline break-all text-blue-600 hover:text-blue-700"
            >
              {part}
            </a>
          )
        })}
        {lineIndex < lines.length - 1 ? <br /> : null}
      </span>
    )
  })
}

export default function ChatMessages({
  messages,
  isTyping,
  quickReplies,
  onQuickReply,
}: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, isTyping])

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-brand/5">
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl p-3 ${
                message.type === 'user'
                  ? 'bg-brand text-white rounded-br-none shadow-sm'
                  : message.type === 'bot'
                    ? 'bg-gold-50/50 text-gray-800 rounded-bl-none border border-gold-50 shadow-sm'
                    : 'bg-white border border-brand/90 rounded-lg w-full shadow-sm'
              }`}
            >
              {message.type === 'card' && message.propertyData ? (
                message.propertyData.map((property) => (
                  <SimplePropertyCard
                    key={property.$id}
                    property={property}
                    onScheduleViewing={() => {}}
                  />
                ))
              ) : (
                <>
                  <p className="text-sm whitespace-pre-wrap">
                    {renderMessageWithLinks(message.content)}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      message.type === 'user'
                        ? 'text-emerald-200'
                        : 'text-gold-600'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 rounded-2xl rounded-bl-none p-3 border border-gray-200 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span className="text-sm text-gray-600">Axon is thinking...</span>
            </div>
          </div>
        )}

        {/* Quick Replies */}
        {messages.length > 1 && quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {quickReplies.map((reply, index) => (
              <button
                key={index}
                onClick={() => onQuickReply(reply.action)}
                className="bg-white border border-gray-300 rounded-full px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 hover:border-emerald-300 transition-colors shadow-sm"
              >
                {reply.label}
              </button>
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
