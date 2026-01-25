// components/chatbot/intents.ts
import { Memory } from './types'

type Intent =
  | 'greeting'
  | 'property_search'
  | 'location_search'
  | 'schedule_viewing'
  | 'contact_agent'
  | 'budget_info'
  | 'clear_chat'
  | 'help'
  | 'basic_qa'
  | 'thanks'
  | 'view_details'
  | 'unknown'

export const detectIntent = (message: string, _memory: Memory): Intent => {
  const text = message.toLowerCase().trim()

  console.log('🧠 Detecting intent for:', text) // Debug log

  // Order matters! More specific first

  // 1. Clear chat intent
  if (/(clear|reset|start over)/i.test(text)) return 'clear_chat'

  // 2. Thanks intent
  if (/(thanks|thank you)/i.test(text)) return 'thanks'

  // 3. Help intent
  if (/(help|what can you do)/i.test(text)) return 'help'

  // 4. Basic Q&A about the bot
  if (/(your name|who are you|what are you)/i.test(text)) return 'basic_qa'

  // 5. Greeting intent (check this BEFORE location_search for "hi lagos" etc)
  if (
    /^(hi|hello|hey)$/i.test(text) ||
    /^(good\s(morning|afternoon|evening))$/i.test(text)
  ) {
    return 'greeting'
  }

  // 6. LOCATION SEARCH - This needs to come BEFORE property_search
  // Check if the message contains location keywords
  const locations = [
    'lagos',
    'abuja',
    'ikeja',
    'lekki',
    'yaba',
    'ikoyi',
    'victoria island',
    'vi',
  ]
  const containsLocation = locations.some((loc) => {
    const regex = new RegExp(`\\b${loc}\\b`, 'i') // Word boundary to match whole words
    return regex.test(text)
  })

  // If it's JUST a location name or contains "in [location]" pattern
  if (
    containsLocation ||
    /(in|at|near|around|within)\s+(lagos|abuja|ikeja|lekki|yaba|ikoyi)/i.test(
      text
    )
  ) {
    console.log('📍 Detected location search:', text) // Debug log
    return 'location_search'
  }

  // 7. Property search (general property inquiry)
  if (
    /property|house|apartment|home|buy.*property|rent.*property|looking.*for.*property/i.test(
      text
    )
  ) {
    console.log('🏠 Detected property search:', text) // Debug log
    return 'property_search'
  }

  // 8. View details intent
  if (
    /details|show me|tell me about|information|more info|see details/i.test(
      text
    )
  )
    return 'view_details'

  // 9. Schedule viewing
  if (/viewing|tour|visit|see.*property|schedule.*viewing/i.test(text))
    return 'schedule_viewing'

  // 10. Contact agent
  if (/agent|contact.*someone|speak.*person|talk.*to.*agent/i.test(text))
    return 'contact_agent'

  // 11. Budget inquiry
  if (/price|cost|budget|how much|afford/i.test(text)) return 'budget_info'

  // 12. If we get a greeting with location, still treat as location_search
  // This handles cases like "hello lagos" or "hi in lekki"
  const greetingWithLocation =
    /^(hi|hello|hey)\s+(in|at)?\s*(lagos|abuja|ikeja|lekki)/i.test(text)
  if (greetingWithLocation) {
    return 'location_search'
  }

  console.log('❓ No intent matched, defaulting to unknown')
  return 'unknown'
}

// Extract memory updates from message - UPDATED VERSION
export const extractMemoryUpdates = (text: string): Partial<Memory> => {
  const updates: Partial<Memory> = {}

  console.log('💾 Extracting memory from:', text) // Debug log

  // Extract name (simplified)
  const nameMatch = text.match(/(?:my name is|I am|call me)\s+(\w+)/i)
  if (nameMatch) {
    updates.name = nameMatch[1]
    console.log('📝 Found name:', updates.name)
  }

  // Extract email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/i)
  if (emailMatch) {
    updates.email = emailMatch[0]
    console.log('📧 Found email:', updates.email)
  }

  // Extract phone (simple pattern)
  const phoneMatch = text.match(/\b\d{10,}\b/)
  if (phoneMatch) {
    updates.phone = phoneMatch[0]
    console.log('📱 Found phone:', updates.phone)
  }

  // Extract location - FIXED with better pattern matching
  const locations = [
    'lagos',
    'abuja',
    'ikeja',
    'lekki',
    'yaba',
    'ikoyi',
    'victoria island',
  ]
  for (const loc of locations) {
    const regex = new RegExp(`\\b${loc}\\b`, 'i')
    if (regex.test(text)) {
      updates.location = loc
      console.log('📍 Found location:', updates.location)
      break
    }
  }

  // Extract bedrooms
  const bedMatch = text.match(/(\d+)\s*(?:bed|br|bedroom)/i)
  if (bedMatch) {
    updates.bedrooms = bedMatch[1]
    console.log('🛏️ Found bedrooms:', updates.bedrooms)
  }

  // Extract budget (simple pattern)
  const budgetMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:million|m|k)/i)
  if (budgetMatch) {
    updates.budget = budgetMatch[0]
    console.log('💰 Found budget:', updates.budget)
  }

  // Extract property type
  const propertyTypes = [
    'duplex',
    'apartment',
    'house',
    'condo',
    'townhouse',
    'land',
    'bungalow',
    'flat',
    'villa',
    'penthouse',
    'studio',
  ]

  for (const type of propertyTypes) {
    const regex = new RegExp(`\\b${type}\\b`, 'i')
    if (regex.test(text)) {
      updates.propertyType = type
      console.log('🏡 Found property type:', updates.propertyType)
      break
    }
  }

  console.log('✅ Memory updates:', updates)
  return updates
}
