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

const LOCATION_RE =
  /\b(lagos|abuja|ikeja|lekki|yaba|ikoyi|victoria island|vi|enugu|anambra|awka|onitsha|nnewi|port harcourt|ibadan|kano|kaduna|jos|calabar|uyo|asaba|owerri|benin|warri|akure)\b/i

const PROPERTY_TYPE_RE =
  /\b(duplex|apartment|house|condo|townhouse|land|bungalow|flat|villa|penthouse|studio)\b/i

const PROPERTY_SIGNAL_RE =
  /\b(property|properties|house|home|apartment|duplex|villa|land|flat|condo|townhouse|buy|purchase|rent|lease|looking\s+for|find|search)\b/i

export const detectIntent = (message: string, _memory: Memory): Intent => {
  const text = message.toLowerCase().trim()

  if (/(clear|reset|start over|new chat)/i.test(text)) return 'clear_chat'
  if (/(thanks|thank you)/i.test(text)) return 'thanks'

  if (
    /^(hi|hello|hey)$/i.test(text) ||
    /^(good\s(morning|afternoon|evening))$/i.test(text)
  ) {
    return 'greeting'
  }

  if (/\bwhat about\s+[a-z]/i.test(text)) return 'location_search'

  if (/(your name|who are you|what are you)/i.test(text)) return 'basic_qa'

  if (
    /viewing|tour|visit|schedule.*viewing|book.*viewing|view it|i like to view|i want to view/i.test(
      text
    )
  ) {
    return 'schedule_viewing'
  }

  if (
    /details|show me|tell me about|information|more info|see details|price range/i.test(
      text
    )
  ) {
    return 'view_details'
  }

  if (/agent|contact.*someone|speak.*person|talk.*to.*agent/i.test(text)) {
    return 'contact_agent'
  }

  if (LOCATION_RE.test(text)) return 'location_search'

  if (PROPERTY_SIGNAL_RE.test(text) || PROPERTY_TYPE_RE.test(text)) {
    return 'property_search'
  }

  if (/price|cost|budget|how much|afford|cheap|low budget|expensive/i.test(text)) {
    return 'budget_info'
  }

  if (/\bhelp\b|what can you do/i.test(text)) return 'help'

  return 'unknown'
}

export const extractMemoryUpdates = (text: string): Partial<Memory> => {
  const updates: Partial<Memory> = {}
  const lower = text.toLowerCase()

  const nameMatch = text.match(/(?:my name is|i am|call me)\s+([a-zA-Z'-]+)/i)
  if (nameMatch) updates.name = nameMatch[1]

  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/i)
  if (emailMatch) updates.email = emailMatch[0]

  const phoneMatch = text.match(/\b\d{10,}\b/)
  if (phoneMatch) updates.phone = phoneMatch[0]

  const locationMatch = text.match(LOCATION_RE)
  if (locationMatch) {
    updates.location = locationMatch[0].toLowerCase()
  } else {
    const whatAboutMatch = lower.match(/\bwhat about\s+([a-z]+(?:\s+[a-z]+){0,2})\b/)
    if (whatAboutMatch) {
      updates.location = whatAboutMatch[1].replace(/\s+state$/, '').trim()
      return updates
    }

    const trailingStateMatch = lower.match(
      /\b([a-z]+(?:\s+[a-z]+){0,2})\s+state\b/
    )
    if (trailingStateMatch) {
      updates.location = trailingStateMatch[1].trim().toLowerCase()
    } else {
      const prepositionLocationMatch = lower.match(
        /\b(?:in|at|around|within|from|near)\s+([a-z]+(?:\s+[a-z]+){0,2})\b/
      )
      if (prepositionLocationMatch) {
        const candidate = prepositionLocationMatch[1]
          .replace(/\b(state|platform|please|now)\b/g, '')
          .trim()
        if (candidate) updates.location = candidate
      } else if (/^[a-z]+(?:\s+[a-z]+){0,2}(?:\s+state)?$/.test(lower)) {
        updates.location = lower.replace(/\s+state$/, '').trim()
      }
    }
  }

  const bedMatch = text.match(/(\d+)\s*(?:bed|br|bedroom)/i)
  if (bedMatch) updates.bedrooms = bedMatch[1]

  const budgetMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:million|m|k)/i)
  if (budgetMatch) {
    updates.budget = budgetMatch[0]
  } else if (/\b(cheap|low budget|affordable)\b/i.test(text)) {
    updates.budget = 'affordable'
  }

  if (/\b(short let|short-let)\b/i.test(text)) {
    updates.listingType = 'short-let'
  } else if (/\b(rent|rental|lease)\b/i.test(text)) {
    updates.listingType = 'rent'
  } else if (/\b(buy|purchase|for sale|outright)\b/i.test(lower)) {
    updates.listingType = 'buy'
  }

  const propertyTypeMatch = text.match(PROPERTY_TYPE_RE)
  if (propertyTypeMatch) {
    updates.propertyType = propertyTypeMatch[0].toLowerCase()
  }

  return updates
}
