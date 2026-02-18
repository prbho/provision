/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { detectIntent, extractMemoryUpdates } from './intents'
import { LeadFlowManager } from './leadFlow'
import { MemoryManager } from './memory'
import { getContextualQuickReplies } from './quickReplies'
import { getShortResponse } from './responses'
import { ChatMessage, LeadFormData, Memory } from './types'

const MAX_MESSAGES = 80
const WELCOME_MESSAGE =
  "Hi! I'm Axon. I can help you find properties, compare options, and schedule viewings. Which location are you interested in?"

type PropertyResult = {
  $id: string
  title?: string
  propertyType?: string
  city?: string
  state?: string
  address?: string
  price?: number
}

type LocationResult = {
  name?: string
  state?: string
  lga?: string
  type?: 'state' | 'lga' | 'area'
  searchTerms?: string[]
}

type CachedLocation = {
  value: LocationResult | null
  expiresAt: number
}

const LOCATION_CACHE_TTL_MS = 10 * 60 * 1000
const locationLookupCache = new Map<string, CachedLocation>()

function parseBudgetToPriceRange(budget?: string): {
  minPrice?: number
  maxPrice?: number
} {
  if (!budget) return {}
  const lower = budget.toLowerCase()
  if (lower === 'affordable') {
    return { maxPrice: 50_000_000 }
  }

  const matched = lower.match(/(\d+(?:\.\d+)?)\s*(million|m|k)/)
  if (!matched) return {}

  const value = Number(matched[1])
  if (!Number.isFinite(value) || value <= 0) return {}

  const unit = matched[2]
  const multiplier = unit === 'k' ? 1_000 : 1_000_000
  return { maxPrice: Math.round(value * multiplier) }
}

function formatPrice(price?: number): string {
  const n = Number(price)
  if (!Number.isFinite(n) || n <= 0) return 'Price on request'
  return `NGN ${n.toLocaleString()}`
}

function formatPropertyResults(properties: PropertyResult[]): string {
  return properties
    .slice(0, 3)
    .map((p, i) => {
      const title = p.title || 'Untitled Property'
      const location = [p.city, p.state].filter(Boolean).join(', ')
      return `${i + 1}. ${title} (${formatPrice(p.price)})${location ? ` - ${location}` : ''}`
    })
    .join('\n')
}

function buildPropertyUrl(propertyId?: string): string {
  if (!propertyId) return ''
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/properties/${propertyId}`
}

function formatPropertyLinks(properties: PropertyResult[]): string {
  return properties
    .slice(0, 3)
    .map((p, i) => {
      const title = p.title || 'Untitled Property'
      const url = buildPropertyUrl(p.$id)
      return `${i + 1}. ${title}: ${url}`
    })
    .join('\n')
}

function toTitleCase(value: string): string {
  return value
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

async function resolveLocationFromApi(
  rawLocation: string
): Promise<LocationResult | null> {
  const q = rawLocation.trim()
  if (!q) return null

  const cached = locationLookupCache.get(q.toLowerCase())
  if (cached && cached.expiresAt > Date.now()) {
    return cached.value
  }

  try {
    const res = await fetch(
      `/api/locations/search?q=${encodeURIComponent(q)}&limit=5`,
      {
        method: 'GET',
      }
    )
    if (!res.ok) return null

    const json = await res.json()
    const locations = Array.isArray(json?.locations) ? json.locations : []
    if (locations.length === 0) return null

    const normalizedInput = q.toLowerCase()
    const exact = locations.find((loc: LocationResult) => {
      const name = String(loc?.name || '').toLowerCase()
      const state = String(loc?.state || '').toLowerCase()
      return normalizedInput === name || normalizedInput === `${state} state`
    })

    const resolved = (exact || locations[0]) as LocationResult
    locationLookupCache.set(q.toLowerCase(), {
      value: resolved,
      expiresAt: Date.now() + LOCATION_CACHE_TTL_MS,
    })
    return resolved
  } catch {
    locationLookupCache.set(q.toLowerCase(), {
      value: null,
      expiresAt: Date.now() + 30_000,
    })
    return null
  }
}

const searchPropertiesFromApi = async (
  memory: Partial<Memory>,
  message?: string
): Promise<PropertyResult[]> => {
  const params = new URLSearchParams()
  params.set('limit', '6')

  if (memory.propertyType) {
    params.set('propertyType', memory.propertyType)
  }
  if (memory.listingType) {
    params.set('type', memory.listingType)
  }
  if (memory.location) {
    const normalized = memory.location.trim().toLowerCase()
    const resolved = await resolveLocationFromApi(normalized)

    if (resolved?.type === 'state') {
      params.set('state', toTitleCase(resolved.name || normalized))
    } else if (resolved?.type === 'lga' || resolved?.type === 'area') {
      if (resolved.name) params.set('city', toTitleCase(resolved.name))
      if (resolved.state) params.set('state', toTitleCase(resolved.state))
    } else if (normalized.endsWith(' state')) {
      params.set('state', toTitleCase(normalized.replace(/\s+state$/, '')))
    } else {
      params.set('city', toTitleCase(resolved?.name || normalized))
      if (resolved?.state) {
        params.set('state', toTitleCase(resolved.state))
      }
    }
  }

  const { minPrice, maxPrice } = parseBudgetToPriceRange(memory.budget)
  if (typeof minPrice === 'number') params.set('minPrice', String(minPrice))
  if (typeof maxPrice === 'number') params.set('maxPrice', String(maxPrice))

  const hasStructuredFilters = Boolean(
    memory.location || memory.propertyType || memory.listingType
  )
  const queryText = (message || '').trim()
  if (queryText && !hasStructuredFilters) {
    params.set('q', queryText)
  }

  const res = await fetch(`/api/properties?${params.toString()}`, {
    method: 'GET',
  })

  if (!res.ok) {
    throw new Error(`Property search failed: ${res.status}`)
  }

  const json = await res.json()
  const docs = Array.isArray(json?.documents) ? json.documents : []
  return docs as PropertyResult[]
}

function resolveIntentWithContext(
  message: string,
  baseIntent: string,
  memory: Memory
): string {
  if (baseIntent !== 'unknown' && baseIntent !== 'help') {
    return baseIntent
  }

  const text = message.trim().toLowerCase()
  const updates = extractMemoryUpdates(text)
  const asksForProperties =
    /\b(find|search|show|i want to buy|buy|purchase|rent|lease|properties?)\b/i.test(
      text
    )

  if (memory.lastQuestionAsked === 'propertyType' && updates.propertyType) {
    return 'property_search'
  }

  if (memory.lastQuestionAsked === 'location' && updates.location) {
    return 'location_search'
  }

  if (asksForProperties && (updates.location || updates.propertyType)) {
    return 'property_search'
  }

  if (asksForProperties && (memory.location || memory.propertyType)) {
    return 'property_search'
  }

  if (baseIntent === 'help' && asksForProperties) {
    return 'property_search'
  }

  return baseIntent
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
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID()
    }
    return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
  }

  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateUniqueId(),
    }
    setMessages((prev) => [...prev, newMessage].slice(-MAX_MESSAGES))
  }, [])

  const addBotMessage = useCallback(
    (content: string) => {
      addMessage({ content, timestamp: new Date(), type: 'bot' })
    },
    [addMessage]
  )

  const startNewChat = useCallback(() => {
    memoryManager.current?.clear()
    setMessages([
      {
        id: generateUniqueId(),
        type: 'bot',
        content: WELCOME_MESSAGE,
        timestamp: new Date(),
      },
    ])
    setDisplayedProperties([])
    setShowLeadForm(false)
    setLeadStep(0)
    setLeadData({})
    setIsTyping(false)
  }, [])

  const getCurrentLeadData = useCallback((): Record<string, string> => {
    return leadData
  }, [leadData])

  const processUserMessage = useCallback(
    async (rawMessage: string) => {
      const message = rawMessage.trim()
      if (!message || !memoryManager.current || !leadFlowManager.current) {
        return
      }

      addMessage({
        content: message,
        timestamp: new Date(),
        type: 'user',
      })

      const currentMemory = memoryManager.current.getMemory()
      const initialIntent = detectIntent(message, currentMemory)
      const intent = resolveIntentWithContext(message, initialIntent, currentMemory)

      memoryManager.current.updateFromIntent(intent, message)
      const updatedMemory = memoryManager.current.getMemory()

      setIsTyping(true)

      setTimeout(() => {
        let response = ''
        const wantsLink =
          /\b(link|url|website|open it|property page)\b/i.test(message)

        switch (intent) {
          case 'clear_chat':
            startNewChat()
            return

          case 'greeting':
            response = getShortResponse(intent, updatedMemory)
            break

          case 'property_search':
            if (!updatedMemory.location) {
              memoryManager.current?.update({ lastQuestionAsked: 'location' })
              response = 'Great. Which location are you interested in?'
            } else if (!updatedMemory.propertyType) {
              memoryManager.current?.update({ lastQuestionAsked: 'propertyType' })
              response = `Nice. What type of property are you looking for in ${updatedMemory.location}?`
            } else {
              searchPropertiesFromApi(updatedMemory, message)
                .then((properties) => {
                  const foundProperties = properties.length
                  memoryManager.current?.update({
                    propertiesFound: foundProperties,
                    lastQuestionAsked: 'none',
                  })

                  if (foundProperties > 0) {
                    setDisplayedProperties(properties)
                    response =
                      `I found ${foundProperties} matching properties. Top options:\n` +
                      `${formatPropertyResults(properties)}\n\n` +
                      'Would you like details or should I help you schedule a viewing?'
                  } else {
                    response = `I couldn't find ${updatedMemory.propertyType} options in ${updatedMemory.location} right now. Want to try another location or property type?`
                  }

                  addBotMessage(response)
                  setIsTyping(false)
                })
                .catch(() => {
                  addBotMessage(
                    'I could not reach the property listings right now. Please try again in a moment.'
                  )
                  setIsTyping(false)
                })
              return
            }
            break

          case 'location_search': {
            const extracted = extractMemoryUpdates(message)
            const location =
              extracted.location?.toLowerCase() || message.toLowerCase().trim()

            const manager = memoryManager.current
            if (!manager) {
              setIsTyping(false)
              return
            }

            manager.update({ location })
            const updatedMem = manager.getMemory()

            if (!updatedMem.propertyType) {
              manager.update({ lastQuestionAsked: 'propertyType' })
              response = `Noted: ${location}. What property type do you want there?`
            } else {
              searchPropertiesFromApi(
                { ...updatedMem, location },
                `${updatedMem.propertyType} in ${location}`
              )
                .then((properties) => {
                  const foundProperties = properties.length
                  manager.update({
                    propertiesFound: foundProperties,
                    lastQuestionAsked: 'none',
                  })

                  if (foundProperties > 0) {
                    setDisplayedProperties(properties)
                    response =
                      `Great, I found ${foundProperties} listings in ${location}. Top options:\n` +
                      `${formatPropertyResults(properties)}\n\n` +
                      'Want me to show more details or schedule a viewing?'
                  } else {
                    response = `No ${updatedMem.propertyType} listings found in ${location} yet. Would you like me to search a nearby area?`
                  }

                  addBotMessage(response)
                  setIsTyping(false)
                })
                .catch(() => {
                  addBotMessage(
                    'I could not reach the property listings right now. Please try again in a moment.'
                  )
                  setIsTyping(false)
                })
              return
            }
            break
          }

          case 'schedule_viewing':
            if (!updatedMemory.location || !updatedMemory.propertyType) {
              response =
                'I can do that. First, tell me the location and property type you want.'
            } else if (displayedProperties.length === 0) {
              response =
                'I need to find matching properties first. Say "find properties" and I will pull options.'
            } else {
              setShowLeadForm(true)
              setLeadStep(0)
              setTimeout(() => {
                addBotMessage("Let's schedule a viewing. What's your name?")
                setIsTyping(false)
              }, 500)
              return
            }
            break

          case 'view_details':
            if (!updatedMemory.location || !updatedMemory.propertyType) {
              response =
                'Share your preferred location and property type, then I will show details.'
            } else if (displayedProperties.length === 0) {
              response =
                'I have no matches loaded yet. Say "find properties" and I will search now.'
            } else {
              const minPrice = displayedProperties.reduce(
                (min, p) => Math.min(min, Number(p.price) || Infinity),
                Infinity
              )
              const maxPrice = displayedProperties.reduce(
                (max, p) => Math.max(max, Number(p.price) || 0),
                0
              )

              response =
                `Here is what I found in ${updatedMemory.location}:\n\n` +
                `- Type: ${updatedMemory.propertyType}\n` +
                `- Results: ${displayedProperties.length}\n` +
                `- Price range: ${formatPrice(minPrice === Infinity ? undefined : minPrice)} - ${formatPrice(maxPrice)}\n\n` +
                'Would you like to schedule a viewing for one?'
            }
            break

          default:
            if (wantsLink && displayedProperties.length > 0) {
              response =
                `Click the link below:\n${formatPropertyLinks(displayedProperties)}\n\n` +
                'Tell me which one you want to view and I will help with next steps.'
            } else {
              response = getShortResponse(
                intent,
                updatedMemory,
                displayedProperties.length
              )
            }
        }

        addBotMessage(response)
        setIsTyping(false)
      }, 400)
    },
    [addBotMessage, addMessage, displayedProperties, startNewChat]
  )

  const updateLeadDataField = useCallback(
    (field: keyof LeadFormData, value: string) => {
      setLeadData((prev) => ({ ...prev, [field]: value }))

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

    let isValid = false
    let currentField = ''

    switch (leadStep) {
      case 0:
        currentField = 'name'
        isValid = !!leadData.name?.trim()
        break
      case 1:
        currentField = 'email'
        isValid = !!leadData.email?.trim()
        break
      case 2:
        currentField = 'phone'
        isValid = !!leadData.phone?.trim()
        break
    }

    if (!isValid) {
      addBotMessage(`Please provide your ${currentField}.`)
      return
    }

    if (leadStep < 2) {
      setLeadStep(leadStep + 1)

      const nextStepMessages = [
        "Great! Now, what's your email address?",
        "Thanks! Finally, what's your phone number?",
      ]

      setTimeout(() => {
        addBotMessage(nextStepMessages[leadStep])
      }, 500)

      return
    }

    setIsTyping(true)

    const success = await leadFlowManager.current.saveToAppwrite()

    setTimeout(() => {
      if (success) {
        addBotMessage('Thank you! Our agent will contact you shortly.')
      } else {
        addBotMessage('There was an error. Please try again.')
      }

      setShowLeadForm(false)
      setLeadStep(0)
      if (leadFlowManager.current) {
        leadFlowManager.current.reset()
      }
      setLeadData({})
      setIsTyping(false)
    }, 1000)
  }, [addBotMessage, leadData, leadStep])

  useEffect(() => {
    memoryManager.current = new MemoryManager()
    leadFlowManager.current = new LeadFlowManager()

    requestAnimationFrame(() => {
      setIsInitialized(true)
      setMessages((prev) =>
        prev.length > 0
          ? prev
          : [
              {
                id: generateUniqueId(),
                type: 'bot',
                content: WELCOME_MESSAGE,
                timestamp: new Date(),
              },
            ]
      )
    })
  }, [])

  useEffect(() => {
    requestAnimationFrame(() => {
      if (memoryManager.current) {
        const replies = getContextualQuickReplies(
          {
            memory: memoryManager.current.getMemory(),
            hasProperties: displayedProperties.length > 0,
            conversationLength: messages.length,
          },
          {
            onPropertySearch: () => processUserMessage('find properties'),
            onScheduleViewing: () => processUserMessage('schedule viewing'),
            onContactAgent: () => processUserMessage('contact agent'),
            onClearChat: () => processUserMessage('new chat'),
            onLocationSearch: () => processUserMessage('search by location'),
            onBudgetInfo: () => processUserMessage('tell me about budget'),
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
