// components/chatbot/Chatbot.tsx
'use client'

import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'

import ChatHeader from './ChatHeader'
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import LeadFormSteps from './LeadFormSteps'
import { LS_VOICE_MUTED_KEY } from './types'
import { useChatEngine } from './useChatEngine'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isVoiceMuted, setIsVoiceMuted] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(LS_VOICE_MUTED_KEY) === 'true'
  })

  const {
    messages,
    isTyping,
    showLeadForm,
    leadStep,
    quickReplies,
    processUserMessage,
    handleQuickReply,
    leadData,
    updateLeadData,
    submitLead,
  } = useChatEngine()

  const handleClearChat = () => {
    processUserMessage('clear chat')
  }

  const toggleVoice = () => {
    setIsVoiceMuted((prev) => !prev)
  }

  useEffect(() => {
    localStorage.setItem(LS_VOICE_MUTED_KEY, String(isVoiceMuted))
  }, [isVoiceMuted])

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed hover:text-white hover:cursor-pointer bottom-6 right-6 w-14 h-14 bg-white hover:bg-brand text-brand rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 hover:scale-110"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-0 right-0 lg:bottom-6 lg:right-6 w-full lg:w-96 h-screen lg:h-[600px] bg-white lg:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <ChatHeader
            onClose={() => setIsOpen(false)}
            onToggleVoice={toggleVoice}
            onClearChat={handleClearChat}
            isVoiceMuted={isVoiceMuted}
            isListening={false}
          />

          <ChatMessages
            messages={messages}
            isTyping={isTyping}
            quickReplies={quickReplies}
            onQuickReply={handleQuickReply}
          />

          {!showLeadForm ? (
            <ChatInput onSend={processUserMessage} />
          ) : (
            <LeadFormSteps
              step={leadStep}
              data={leadData}
              onChange={updateLeadData}
              onSubmit={submitLead}
            />
          )}
        </div>
      )}
    </>
  )
}
