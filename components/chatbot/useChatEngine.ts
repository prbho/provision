// components/chatbot/useChatEngine.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { detectIntent, extractMemoryUpdates } from './intents'
import { LeadFlowManager } from './leadFlow'
import { MemoryManager } from './memory'
import { getContextualQuickReplies } from './quickReplies'
import { getShortResponse } from './responses'
import { ChatMessage, LeadFormData, Memory } from './types'

const mockSearchProperties = async (filters: Partial<Memory>) => {
  console.log('🔍 Searching properties with filters:', filters)
  return [
    {
      id: '1',
      title: 'Beautiful 3-bedroom apartment in Lagos',
      price: 50000000,
      bedrooms: 3,
      bathrooms: 2,
      city: 'Lagos',
      address: 'Lekki Phase 1',
      images: ['/placeholder-property.jpg'],
    },
  ]
}

export const useChatEngine = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [displayedProperties, setDisplayedProperties] = useState<any[]>([])
  const [leadStep, setLeadStep] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [leadData, setLeadData] = useState<Record<string, string>>({})
  const [quickReplies, setQuickReplies] = useState<any[]>([])

  const memoryManager = useRef<MemoryManager | null>(null)
  const leadFlowManager = useRef<LeadFlowManager | null>(null)

  const generateUniqueId = (): string => {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateUniqueId(),
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])

  const getCurrentLeadData = useCallback((): Record<string, string> => {
    return leadData
  }, [leadData])

  // Define processUserMessage early so it can be referenced
  const processUserMessage = useCallback(
    async (message: string) => {
      console.log('💬 Processing message:', message)

      if (!memoryManager.current || !leadFlowManager.current) {
        console.error('Managers not initialized yet')
        return
      }

      addMessage({
        content: message,
        timestamp: new Date(),
        type: 'user',
      })

      const intent = detectIntent(message, memoryManager.current.getMemory())
      console.log('🎯 Detected intent:', intent)

      // Update memory in a non-render context
      setTimeout(() => {
        if (memoryManager.current) {
          memoryManager.current.updateFromIntent(intent, message)
        }
      }, 0)

      // Update lead form with memory data
      setTimeout(() => {
        if (memoryManager.current && leadFlowManager.current) {
          leadFlowManager.current.updateFromMemory(
            memoryManager.current.getMemory()
          )
        }
      }, 0)

      setIsTyping(true)

      switch (intent) {
        case 'clear_chat':
          setMessages([])
          setTimeout(() => {
            if (memoryManager.current) {
              memoryManager.current.clear()
            }
          }, 0)
          setDisplayedProperties([])
          setIsTyping(false)
          break

        case 'location_search':
          // Handle location search
          console.log('📍 Handling location search for:', message)

          if (!memoryManager.current) return

          const updates = extractMemoryUpdates(message)
          if (updates.location) {
            memoryManager.current.update({ location: updates.location })
          }

          try {
            const properties = await mockSearchProperties({
              location: updates.location || message,
            })

            if (properties.length > 0) {
              setDisplayedProperties(properties)

              setTimeout(() => {
                addMessage({
                  content: `Great! I found ${properties.length} property${properties.length > 1 ? 'ies' : ''} in ${updates.location || message}.`,
                  timestamp: new Date(),
                  type: 'bot',
                })

                setTimeout(() => {
                  addMessage({
                    content:
                      'Would you like to see the details or schedule a viewing?',
                    timestamp: new Date(),
                    type: 'bot',
                  })
                  setIsTyping(false)
                }, 500)
              }, 1000)
            } else {
              setTimeout(() => {
                addMessage({
                  content: `I couldn't find any properties in ${updates.location || message} right now. Would you like to try another location or get notified when properties become available?`,
                  timestamp: new Date(),
                  type: 'bot',
                })
                setIsTyping(false)
              }, 1000)
            }
          } catch (error) {
            console.error('Error searching properties:', error)
            setTimeout(() => {
              addMessage({
                content:
                  'Sorry, I encountered an error searching for properties. Please try again.',
                timestamp: new Date(),
                type: 'bot',
              })
              setIsTyping(false)
            }, 1000)
          }
          break

        case 'contact_agent':
          setShowLeadForm(true)
          setLeadStep(0)
          setTimeout(() => {
            addMessage({
              content:
                "I'd be happy to connect you with an agent! Please share your contact details below.",
              timestamp: new Date(),
              type: 'bot',
            })
            setIsTyping(false)
          }, 500)
          break

        case 'schedule_viewing':
          setShowLeadForm(true)
          setLeadStep(1)
          setTimeout(() => {
            addMessage({
              content:
                "Let's schedule a viewing! Please tell us when you'd like to visit.",
              timestamp: new Date(),
              type: 'bot',
            })
            setIsTyping(false)
          }, 500)
          break

        default:
          const response = getShortResponse(intent, {})
          setTimeout(() => {
            addMessage({
              content: response,
              timestamp: new Date(),
              type: 'bot',
            })
            setIsTyping(false)
          }, 500)
      }
    },
    [addMessage]
  )

  const updateQuickReplies = useCallback(() => {
    if (!memoryManager.current) {
      setQuickReplies([])
      return
    }

    const replies = getContextualQuickReplies(
      {
        memory: memoryManager.current.getMemory(),
        hasProperties: displayedProperties.length > 0,
        conversationLength: messages.length,
      },
      {
        onPropertySearch: () => processUserMessage('Find properties'),
        onScheduleViewing: () => processUserMessage('Schedule viewing'),
        onContactAgent: () => processUserMessage('Contact agent'),
        onClearChat: () => processUserMessage('Clear chat'),
        onLocationSearch: () => processUserMessage('Search by location'),
        onBudgetInfo: () => processUserMessage('Tell me about budget'),
      }
    )

    setQuickReplies(replies)
  }, [messages.length, displayedProperties.length, processUserMessage])

  const updateLeadDataField = useCallback(
    (field: keyof LeadFormData, value: string) => {
      setLeadData((prev) => ({ ...prev, [field]: value }))

      // Update the lead flow manager in a non-render context
      setTimeout(() => {
        if (leadFlowManager.current) {
          leadFlowManager.current.updateField(field, value)
        }
      }, 0)
    },
    []
  )

  const handleQuickReply = (action: () => void) => {
    action()
  }

  const submitLead = useCallback(async () => {
    if (!leadFlowManager.current) return

    // Check if form is valid using the state
    const requiredFields = ['name', 'email', 'phone']
    const isValid = requiredFields.every((field) => leadData[field]?.trim())

    if (!isValid) {
      addMessage({
        content: 'Please fill in all required fields: name, email, and phone.',
        timestamp: new Date(),
        type: 'bot',
      })
      return
    }

    setIsTyping(true)

    // Save lead data to state manager
    const success = await leadFlowManager.current.saveToAppwrite()

    setTimeout(() => {
      if (success) {
        addMessage({
          content: 'Thank you! Our agent will contact you shortly.',
          timestamp: new Date(),
          type: 'bot',
        })
      } else {
        addMessage({
          content: 'There was an error. Please try again.',
          timestamp: new Date(),
          type: 'bot',
        })
      }

      setShowLeadForm(false)
      setLeadStep(0)
      if (leadFlowManager.current) {
        leadFlowManager.current.reset()
      }
      setLeadData({})
      setIsTyping(false)
    }, 1000)
  }, [addMessage, leadData])

  // Initialize managers only on client side
  useEffect(() => {
    memoryManager.current = new MemoryManager()
    leadFlowManager.current = new LeadFlowManager()

    // Use requestAnimationFrame to defer state updates
    requestAnimationFrame(() => {
      setIsInitialized(true)
      // Update quick replies after initialization
      if (memoryManager.current) {
        const replies = getContextualQuickReplies(
          {
            memory: memoryManager.current.getMemory(),
            hasProperties: false,
            conversationLength: 0,
          },
          {
            onPropertySearch: () => processUserMessage('Find properties'),
            onScheduleViewing: () => processUserMessage('Schedule viewing'),
            onContactAgent: () => processUserMessage('Contact agent'),
            onClearChat: () => processUserMessage('Clear chat'),
            onLocationSearch: () => processUserMessage('Search by location'),
            onBudgetInfo: () => processUserMessage('Tell me about budget'),
          }
        )
        setQuickReplies(replies)
      }
    })
  }, [processUserMessage])

  // Update quick replies whenever relevant state changes
  useEffect(() => {
    // Use requestAnimationFrame to defer state updates
    requestAnimationFrame(() => {
      if (memoryManager.current) {
        const replies = getContextualQuickReplies(
          {
            memory: memoryManager.current.getMemory(),
            hasProperties: displayedProperties.length > 0,
            conversationLength: messages.length,
          },
          {
            onPropertySearch: () => processUserMessage('Find properties'),
            onScheduleViewing: () => processUserMessage('Schedule viewing'),
            onContactAgent: () => processUserMessage('Contact agent'),
            onClearChat: () => processUserMessage('Clear chat'),
            onLocationSearch: () => processUserMessage('Search by location'),
            onBudgetInfo: () => processUserMessage('Tell me about budget'),
          }
        )
        setQuickReplies(replies)
      }
    })
  }, [messages.length, displayedProperties.length, processUserMessage])

  return {
    messages,
    isTyping,
    showLeadForm,
    leadStep,
    quickReplies,
    processUserMessage,
    handleQuickReply,
    leadData: getCurrentLeadData(),
    updateLeadData: updateLeadDataField,
    submitLead,
    isInitialized,
  }
}
