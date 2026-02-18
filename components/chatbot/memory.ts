// components/chatbot/memory.ts
import { extractMemoryUpdates } from './intents'
import { LS_MEMORY_KEY, Memory } from './types'

export class MemoryManager {
  private memory: Memory = {}

  constructor() {
    this.loadFromStorage()
  }

  public loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(LS_MEMORY_KEY)
      if (saved) {
        this.memory = JSON.parse(saved)
      }
    } catch (error) {
      console.warn('Error loading memory:', error)
    }
  }

  public saveToStorage(): void {
    if (Object.keys(this.memory).length > 0) {
      localStorage.setItem(LS_MEMORY_KEY, JSON.stringify(this.memory))
    }
  }

  public updateFromIntent(intent: string, message: string): void {
    const updates = extractMemoryUpdates(message)

    // Intent-aware memory updates
    switch (intent) {
      case 'property_search':
        // Keep all search-relevant context so follow-up prompts are coherent
        if (updates.location) this.memory.location = updates.location
        if (updates.bedrooms) this.memory.bedrooms = updates.bedrooms
        if (updates.propertyType) this.memory.propertyType = updates.propertyType
        if (updates.budget) this.memory.budget = updates.budget
        if (updates.listingType) this.memory.listingType = updates.listingType
        break

      case 'location_search':
        if (updates.location) this.memory.location = updates.location
        break

      case 'contact_agent':
        // Prioritize contact info for agent contact
        if (updates.name) this.memory.name = updates.name
        if (updates.email) this.memory.email = updates.email
        if (updates.phone) this.memory.phone = updates.phone
        break

      default:
        // For all other intents, update everything
        Object.assign(this.memory, updates)
    }

    this.saveToStorage()
  }

  public getMemory(): Memory {
    return { ...this.memory }
  }

  public update(updates: Partial<Memory>): void {
    Object.assign(this.memory, updates)
    this.saveToStorage()
  }

  public clear(): void {
    this.memory = {}
    localStorage.removeItem(LS_MEMORY_KEY)
  }

  public getRelevantInfo(): string {
    const info = []
    if (this.memory.location) info.push(`location: ${this.memory.location}`)
    if (this.memory.bedrooms) info.push(`bedrooms: ${this.memory.bedrooms}`)
    if (this.memory.budget) info.push(`budget: ${this.memory.budget}`)
    if (this.memory.name) info.push(`name: ${this.memory.name}`)

    return info.join(', ')
  }
}
