export const OnboardingStep = {
  Interests: 0,
  AboutYou: 1,
  MatchPreferencesV2: 2,
  DealbreakersLifestyle:3,
  Photos: 4,
} as const

export type OnboardingStep =
  (typeof OnboardingStep)[keyof typeof OnboardingStep]
