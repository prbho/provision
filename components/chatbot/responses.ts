// components/chatbot/responses.ts
import { Memory } from './types'

export const getShortResponse = (
  intent: string,
  memory: Memory,
  propertyCount = 0
): string => {
  switch (intent) {
    case 'greeting':
      return memory.name
        ? `Hi ${memory.name}! What kind of property are you looking for?`
        : "Hi! I'm Axon. What kind of property are you looking for?"

    case 'property_search':
      if (!memory.location) {
        return 'Sure. Which location are you interested in?'
      }

      if (!memory.propertyType) {
        return `Got it. What type of property are you looking for in ${memory.location}?`
      }

      if (propertyCount > 0) {
        return `Great! I found ${propertyCount} ${memory.propertyType}(s) in ${memory.location}. Would you like details or to schedule a viewing?`
      }

      return `Searching for ${memory.propertyType} in ${memory.location}...`

    case 'location_search':
      if (memory.location && memory.lastQuestionAsked !== 'location') {
        return `You already selected ${memory.location}. What type of property are you looking for there?`
      }

      if (memory.propertyType && !memory.location) {
        return `Looking for ${memory.propertyType}. Which location are you interested in?`
      }

      return 'Noted. What type of property are you looking for?'

    case 'view_details':
      if (propertyCount > 0) {
        return 'Here are the property details. Would you like to schedule a viewing?'
      }
      return 'Please search for properties first to see details.'

    case 'schedule_viewing':
      if (!memory.location || !memory.propertyType) {
        return 'Let me get a few details first. What location are you interested in?'
      }
      if (propertyCount === 0) {
        return 'Please search for properties first, then I can help you schedule a viewing.'
      }
      return 'Perfect. Which property would you like to schedule a viewing for?'

    case 'basic_qa':
      return "I'm Axon. I help you find verified properties, schedule viewings, and connect you with trusted agents."

    case 'help':
      return (
        'I can help you with:\n' +
        '- Finding properties\n' +
        '- Scheduling viewings\n' +
        '- Connecting with agents\n' +
        '- Budget guidance'
      )

    case 'clear_chat':
      return 'Chat cleared. How can I help you today?'

    case 'thanks':
      return "You're welcome. Is there anything else I can help you with?"

    default:
      if (!memory.location) {
        return 'Which location are you interested in?'
      }
      if (!memory.propertyType) {
        return `What type of property are you looking for in ${memory.location}?`
      }
      return 'How can I help you further with this property?'
  }
}
