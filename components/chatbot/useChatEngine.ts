/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { detectIntent, extractMemoryUpdates } from './intents'
import { LeadFlowManager } from './leadFlow'
import { MemoryManager } from './memory'
import { getContextualQuickReplies } from './quickReplies'
import { getShortResponse } from './responses'
import { ChatMessage, LeadFormData, Memory } from './types'

// Update the mockSearchProperties function:
const mockSearchProperties = async (filters: Partial<Memory>) => {
  console.log('🔍 Searching properties with filters:', filters)

  // Mock data based on filters
  const mockProperties = [
    {
      id: '1',
      title: 'Beautiful Duplex in Lagos',
      price: 50000000,
      bedrooms: 4,
      bathrooms: 3,
      city: 'Lagos',
      address: 'Lekki Phase 1',
      images: ['/placeholder-property.jpg'],
      propertyType: 'duplex',
    },
    {
      id: '2',
      title: 'Modern Apartment in Abuja',
      price: 35000000,
      bedrooms: 3,
      bathrooms: 2,
      city: 'Abuja',
      address: 'Wuse 2',
      images: ['/placeholder-property.jpg'],
      propertyType: 'apartment',
    },
  ]

  // Filter by location and property type
  let filtered = mockProperties

  if (filters.location) {
    filtered = filtered.filter((p) =>
      p.city.toLowerCase().includes(filters.location!.toLowerCase())
    )
  }

  if (filters.propertyType) {
    filtered = filtered.filter((p) =>
      p.propertyType.toLowerCase().includes(filters.propertyType!.toLowerCase())
    )
  }

  console.log('✅ Found properties:', filtered.length)
  return filtered
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

  const processUserMessage = useCallback(
    async (message: string) => {
      console.log('💬 Processing message:', message)

      if (!memoryManager.current || !leadFlowManager.current) {
        console.error('Managers not initialized yet')
        return
      }

      // Add user message
      addMessage({
        content: message,
        timestamp: new Date(),
        type: 'user',
      })

      // Get current memory
      const currentMemory = memoryManager.current.getMemory()
      console.log('🧠 Current memory:', currentMemory)

      // Detect intent
      const intent = detectIntent(message, currentMemory)
      console.log('🎯 Detected intent:', intent)

      // Update memory from intent
      memoryManager.current.updateFromIntent(intent, message)

      // Get updated memory
      const updatedMemory = memoryManager.current.getMemory()

      setIsTyping(true)

      // Handle different intents with proper conversation flow
      setTimeout(() => {
        let response = ''
        let foundProperties = 0

        switch (intent) {
          case 'clear_chat':
            memoryManager.current?.clear()
            setMessages([])
            setDisplayedProperties([])
            response = 'Chat cleared! How can I help you today?'
            break

          case 'greeting':
            response = getShortResponse(intent, updatedMemory)
            break

          case 'property_search':
            // Check if we need location or property type
            if (!updatedMemory.location) {
              updatedMemory.lastQuestionAsked = 'location'
              response = 'Which location are you interested in?'
            } else if (!updatedMemory.propertyType) {
              updatedMemory.lastQuestionAsked = 'propertyType'
              response = `Got it 👍 What type of property are you looking for in ${updatedMemory.location}?`
            } else {
              // Both location and property type are known - search properties
              mockSearchProperties({
                location: updatedMemory.location,
                propertyType: updatedMemory.propertyType,
              }).then((properties) => {
                foundProperties = properties.length
                updatedMemory.propertiesFound = foundProperties
                memoryManager.current?.update(updatedMemory)

                if (foundProperties > 0) {
                  setDisplayedProperties(properties)
                  response = `Great! I found ${foundProperties} ${updatedMemory.propertyType}(s) in ${updatedMemory.location}. Would you like to see the details or schedule a viewing?`
                } else {
                  response = `I couldn't find any ${updatedMemory.propertyType} in ${updatedMemory.location}. Would you like to try another location or property type?`
                }

                // Add bot response
                addMessage({
                  content: response,
                  timestamp: new Date(),
                  type: 'bot',
                })
                setIsTyping(false)
              })
              return // Exit early for async operation
            }
            break

          case 'location_search':
            // Extract location from message
            const locationMatch = message.match(
              /\b(lagos|abuja|ikeja|lekki|yaba|ikoyi)\b/i
            )
            const location = locationMatch ? locationMatch[0] : message

            // Update memory with location
            if (memoryManager.current) {
              memoryManager.current.update({ location })
            }
            const updatedMem = memoryManager.current?.getMemory()

            if (!updatedMem || !updatedMem.propertyType) {
              response = `Great! Looking for properties in ${location}. What type of property are you looking for?`
            } else {
              // Both location and property type known - search
              mockSearchProperties({
                location: location,
                propertyType: updatedMem.propertyType,
              }).then((properties) => {
                foundProperties = properties.length
                memoryManager.current?.update({
                  propertiesFound: foundProperties,
                })

                if (foundProperties > 0) {
                  setDisplayedProperties(properties)
                  response = `Great! I found ${foundProperties} ${updatedMem.propertyType}(s) in ${location}. Would you like to see the details or schedule a viewing?`
                } else {
                  response = `I couldn't find any ${updatedMem.propertyType} in ${location}. Would you like to try another location or property type?`
                }

                addMessage({
                  content: response,
                  timestamp: new Date(),
                  type: 'bot',
                })
                setIsTyping(false)
              })
              return
            }
            break

          case 'schedule_viewing':
            if (!updatedMemory.location || !updatedMemory.propertyType) {
              response =
                'Let me get a few details first. What location are you interested in?'
            } else if (displayedProperties.length === 0) {
              response =
                'Please search for properties first, then I can help you schedule a viewing.'
            } else {
              setShowLeadForm(true)
              setLeadStep(0) // Changed from 1 to 0 - start with name
              setTimeout(() => {
                addMessage({
                  content: "Let's schedule a viewing! First, what's your name?",
                  timestamp: new Date(),
                  type: 'bot',
                })
                setIsTyping(false)
              }, 500)
              return // Exit early since we're showing a message
            }
            break

          case 'view_details':
            if (!updatedMemory.location || !updatedMemory.propertyType) {
              response =
                'Let me get a few details first. What location are you interested in?'
            } else if (displayedProperties.length === 0) {
              response =
                'Please search for properties first, then I can show you the details.'
            } else {
              // Calculate min and max prices
              const minPrice = displayedProperties.reduce(
                (min, p) => Math.min(min, p.price),
                Infinity
              )
              const maxPrice = displayedProperties.reduce(
                (max, p) => Math.max(max, p.price),
                0
              )

              response =
                `Here are the details for properties in ${updatedMemory.location}:\n\n` +
                `• Property Type: ${updatedMemory.propertyType}\n` +
                `• Found: ${displayedProperties.length} properties\n` +
                `• Price range: ₦${minPrice.toLocaleString()} - ₦${maxPrice.toLocaleString()}\n\n` +
                `Would you like to schedule a viewing for any of these?`
            }
            break

          default:
            response = getShortResponse(
              intent,
              updatedMemory,
              displayedProperties.length
            )
        }

        // Add bot response (for non-async cases)
        addMessage({
          content: response,
          timestamp: new Date(),
          type: 'bot',
        })
        setIsTyping(false)
      }, 500)
    },
    [addMessage, displayedProperties] // ✅ Fixed: Use full displayedProperties array
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

    // Check if current step is valid
    let isValid = false
    let currentField = ''
    let nextStepField = ''

    switch (leadStep) {
      case 0: // name step
        currentField = 'name'
        isValid = !!leadData.name?.trim()
        nextStepField = 'email'
        break
      case 1: // email step
        currentField = 'email'
        isValid = !!leadData.email?.trim()
        nextStepField = 'phone'
        break
      case 2: // phone step (final step)
        currentField = 'phone'
        isValid = !!leadData.phone?.trim()
        break
    }

    if (!isValid) {
      addMessage({
        content: `Please provide your ${currentField}.`,
        timestamp: new Date(),
        type: 'bot',
      })
      return
    }

    // If we're not on the last step, go to next step
    if (leadStep < 2) {
      setLeadStep(leadStep + 1)

      // Show message for next step
      const nextStepMessages = [
        "Great! Now, what's your email address?",
        "Thanks! Finally, what's your phone number?",
      ]

      setTimeout(() => {
        addMessage({
          content: nextStepMessages[leadStep],
          timestamp: new Date(),
          type: 'bot',
        })
      }, 500)

      return
    }

    // We're on the last step (phone), submit the lead
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
  }, [addMessage, leadData, leadStep])

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
