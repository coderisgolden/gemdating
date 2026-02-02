import { useState } from 'react'
import { OnboardingLayout } from '../components/OnboardingLayout'
import type { Interest } from '../types'
import { InterestCard } from '../components/InterestCard'

type InterestsStepProps = {
  interests: Interest[]
  selectedIds: string[]
  onToggle: (id: string) => void
  onContinue: () => void
}

export function InterestsStep({
  interests,
  selectedIds,
  onToggle,
  onContinue,
}: InterestsStepProps) {
  const [error, setError] = useState<string | null>(null)

  const handleNext = () => {
    if (selectedIds.length === 0) {
      setError('Select at least one interest')
      return
    }

    setError(null)
    onContinue()
  }

  return (
    <OnboardingLayout
      title="Choose your interests"
      subtitle="Pick a few things you like"
      onNext={handleNext}
      nextDisabled={false}
    >
      {/* <div
        className={[
          'grid grid-cols-2 md:grid-cols-3 gap-4 rounded-xl p-2 transition-colors',
          error ? 'border border-red-400 bg-red-50/30' : '',
        ].join(' ')}
      > */}

      <div
  className={[
    'grid grid-cols-2 md:grid-cols-3 gap-4 rounded-xl p-2 transition-colors',
    error ? ' bg-red-50/30 animate-shake' : '',
  ].join(' ')}
>

        {interests.map((interest) => (
          <InterestCard
            key={interest.id}
            interest={interest}
            selected={selectedIds.includes(interest.id)}
            onToggle={onToggle}
          />
        ))}
      </div>

      {/* {error && (
        <p className="mt-4 text-sm text-red-500 text-center animate-fade">
          {error}
        </p>
      )} */}

      {error && (
  <p className="mt-4 text-sm text-red-500 text-center animate-fade">
    {error}
  </p>
)}

    </OnboardingLayout>
  )
}
