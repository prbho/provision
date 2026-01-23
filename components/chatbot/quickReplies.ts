// components/chatbot/quickReplies.ts
import { Memory, QuickReply } from './types'

interface QuickReplyContext {
  memory: Memory
  hasProperties: boolean
  conversationLength: number
}

export const getContextualQuickReplies = (
  context: QuickReplyContext,
  actions: {
    onPropertySearch: () => void
    onScheduleViewing: () => void
    onContactAgent: () => void
    onClearChat: () => void
    onLocationSearch: () => void
    onBudgetInfo: () => void
  }
): QuickReply[] => {
  const { memory, hasProperties, conversationLength } = context

  const baseReplies: QuickReply[] = [
    {
      label: '🏠 Find Properties',
      action: actions.onPropertySearch,
    },
    {
      label: '📍 Search by Location',
      action: actions.onLocationSearch,
    },
  ]

  // If we already have properties in conversation
  if (hasProperties) {
    baseReplies.push({
      label: '📅 Schedule Viewing',
      action: actions.onScheduleViewing,
    })
  }

  // If we have some user info, suggest agent contact
  if (memory.name || memory.email || memory.phone) {
    baseReplies.push({
      label: '👨‍💼 Contact Agent',
      action: actions.onContactAgent,
    })
  }

  // If we have budget info but no properties
  if (memory.budget && !hasProperties) {
    baseReplies.push({
      label: `💰 ${memory.budget} Budget`,
      action: actions.onPropertySearch,
    })
  }

  // If we have location info but no properties
  if (memory.location && !hasProperties) {
    baseReplies.push({
      label: `📍 ${memory.location} Properties`,
      action: actions.onPropertySearch,
    })
  }

  // Add budget info if not provided
  if (!memory.budget) {
    baseReplies.push({
      label: '💰 Budget Info',
      action: actions.onBudgetInfo,
    })
  }

  // Add clear chat option for longer conversations
  if (conversationLength > 5) {
    baseReplies.push({
      label: '🗑️ Clear Chat',
      action: actions.onClearChat,
    })
  }

  // Limit to 4-5 quick replies
  return baseReplies.slice(0, 5)
}

// Quick reply templates for specific contexts
export const getQuickRepliesForPropertyViewing = (
  propertyTitle: string
): QuickReply[] => [
  {
    label: `📅 View ${propertyTitle}`,
    action: () => {}, // Will be overridden
  },
  {
    label: '📍 Similar Properties',
    action: () => {},
  },
  {
    label: '💰 Price Details',
    action: () => {},
  },
]
