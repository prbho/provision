// components/chatbot/leadFlow.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ID } from 'appwrite'

import { databases } from '@/lib/appwrite'

import { DATABASE_ID, LeadFormData, LEADS_COLLECTION_ID } from './types'

type NewType = any

export class LeadFlowManager {
  private leadData: LeadFormData

  constructor(initialData?: Partial<LeadFormData>) {
    this.leadData = {
      name: '',
      email: '',
      phone: '',
      propertyInterest: '',
      budget: '',
      timeline: '',
      message: '',
      bedrooms: '',
      location: '',
      ...initialData,
    }
  }

  public getLeadData(): LeadFormData {
    return { ...this.leadData }
  }

  public updateField<K extends keyof LeadFormData>(
    field: K,
    value: LeadFormData[K]
  ): void {
    this.leadData[field] = value
  }

  public updateFromMemory(memory: NewType): void {
    if (memory.name) this.leadData.name = memory.name
    if (memory.email) this.leadData.email = memory.email
    if (memory.phone) this.leadData.phone = memory.phone
    if (memory.location) this.leadData.location = memory.location
    if (memory.bedrooms) this.leadData.bedrooms = String(memory.bedrooms)
    if (memory.budget) this.leadData.budget = memory.budget
  }

  public async saveToAppwrite(): Promise<boolean> {
    try {
      const leadDocument = {
        name: this.leadData.name,
        email: this.leadData.email,
        phone: this.leadData.phone,
        propertyInterest: this.leadData.propertyInterest,
        budget: this.leadData.budget,
        timeline: this.leadData.timeline,
        message: this.leadData.message,
        bedrooms: this.leadData.bedrooms,
        location: this.leadData.location,
        source: 'chatbot' as const,
        status: 'new' as const,
      }

      await databases.createDocument(
        DATABASE_ID,
        LEADS_COLLECTION_ID,
        ID.unique(),
        leadDocument
      )

      return true
    } catch (error) {
      console.error('Error saving lead:', error)
      return false
    }
  }

  public isValid(): boolean {
    return !!(
      this.leadData.name.trim() &&
      this.leadData.email.trim() &&
      this.leadData.phone.trim()
    )
  }

  public reset(): void {
    this.leadData = {
      name: '',
      email: '',
      phone: '',
      propertyInterest: '',
      budget: '',
      timeline: '',
      message: '',
      bedrooms: '',
      location: '',
    }
  }
}
