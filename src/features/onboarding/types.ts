import type { LucideIcon } from 'lucide-react'

export type Interest = {
  id: string
  title: string
  icon: LucideIcon
  description?: string
}

export type AboutYouValues = {
  height?: string
  education?: string
  occupation?: string
  pets: string[]
  relationshipStatus?: string
}

export type MatchPreferencesValues = {
  dealbreakers: {
    one?: string
    two?: string
    three?: string
    additional?: string
  }
  idealMatch: {
    personality?: string
    interests?: string
    values?: string
    lifestyle?: string
    relationshipGoal?: string
    qualities: string[]
    notes?: string
  }
}

export type DealbreakersLifestyleValues = {
  smoking?: string
  drinking?: string
  children?: string
  pets?: string
  distance?: string
  additional?: string
}

export type MatchPreferencesV2Values = {
  ageRange?: string
  distance?: string
  interestedIn?: string
  relationshipTypes: string[]
  education?: string
  lifestyle?: string
  interests: string[]
  religion?: string
  smoking?: string
  drinking?: string
  children?: string
  notes?: string
}

export type OnboardingData = {
  interests: string[]
  aboutYou: AboutYouValues
  matchPreferences: MatchPreferencesValues
  dealbreakersLifestyle: DealbreakersLifestyleValues
  matchPreferencesV2: MatchPreferencesV2Values
  photos: File[]
}

// types.ts
export type PhotoUploadValues = {
  files: File[]
}
