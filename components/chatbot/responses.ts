// components/chatbot/responses.ts
import { Memory } from './types'

export const getShortResponse = (
  intent: string,
  memory: Memory,
  count: number = 0
): string => {
  switch (intent) {
    case 'greeting':
      return memory.name
        ? `Hi ${memory.name}! 👋 How can I help?`
        : "Hi there! I'm Axon, your property assistant. How can I help?"

    case 'thanks':
      return "You're welcome! 😊 What else can I do for you?"

    case 'property_search':
      return count > 0
        ? `Found ${count} properties!`
        : 'Looking for properties? Tell me what you need.'

    case 'schedule_viewing':
      return 'I can schedule a viewing. Which property interests you?'

    case 'contact_agent':
      return "I'll connect you with an agent. Please share your details."

    case 'basic_qa':
      return "I'm Axon, your property assistant. I help find properties, schedule viewings, and connect with agents."

    case 'location_search':
      return "Tell me which location you're interested in."

    case 'budget_info':
      return "What's your budget range?"

    case 'clear_chat':
      return 'Chat cleared. What can I help with now?'

    case 'help':
      return 'I can help you: 1) Find properties 2) Schedule viewings 3) Connect with agents 4) Get pricing info'

    case 'unknown':
    default:
      return "I can help you find properties. Tell me what you're looking for."
  }
}

export const getQuickGreeting = (): string => {
  const greetings = [
    "Hi! I'm Axon. How can I assist you today?",
    'Hello! Ready to help with your property search.',
    "Welcome! I'm here to help you find properties.",
  ]
  return greetings[Math.floor(Math.random() * greetings.length)]
}
