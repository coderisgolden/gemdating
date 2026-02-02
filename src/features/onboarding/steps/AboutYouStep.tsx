import { useState } from 'react'
import { OnboardingLayout } from '../components/OnboardingLayout'
import type { AboutYouValues } from '../types'
import { UserRound } from 'lucide-react'



type AboutYouStepProps = {
  values: AboutYouValues
  onChange: (patch: Partial<AboutYouValues>) => void
  onContinue: () => void
  onBack: () => void
}

export function AboutYouStep({
  values,
  onChange,
  onContinue,
  onBack,
}: AboutYouStepProps) {
  const [showError, setShowError] = useState(false)

  // ✅ POLICY: minst 1 valt
  const isValid =
    !!values.height ||
    !!values.education ||
    !!values.occupation ||
    values.pets.length > 0 ||
    !!values.relationshipStatus

  function handleNext() {
    if (!isValid) {
      setShowError(true)
      return
    }
    onContinue()
  }

  const fieldClass =
    'border rounded-md px-3 py-2 transition w-full ' +
    'border-neutral-300 ' +
    'hover:border-brand-400 ' +
    'focus:outline-none focus:ring-2 focus:ring-brand-100 focus:border-brand-200'

  return (
    <OnboardingLayout
      title="Tell us about yourself"
      subtitle="This helps us personalize your matches"
      onBack={onBack}
      onNext={handleNext}
    >
      <div
        className={[
          'space-y-8 transition',
          showError && !isValid ? 'animate-shake' : '',
        ].join(' ')}
      >
        {showError && !isValid && (
          <p className="text-sm text-red-500">
            Please fill in at least one field before continuing.
          </p>
        )}

        {/* Basic info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
         <div className="flex items-center gap-3 mb-4">
            <div className="bg-brand-100 rounded-full p-2">
              <UserRound className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              Lifestyle Preferences
            </h3>
          </div>

          {/* Height */}
          <div className="flex flex-col gap-1">
            < label className='text-sm leading-none font-medium pb-1'>
              Height
            </label>
            <select
              value={values.height ?? ''}
              onChange={(e) =>
                onChange({ height: e.target.value })
              }
              className={fieldClass}
            >
              <option value="">Select height</option>
              <option value="under-160">Under 160 cm</option>
              <option value="160-170">160–170 cm</option>
              <option value="170-180">170–180 cm</option>
              <option value="180+">180+ cm</option>
            </select>
          </div>

          {/* Education */}
          <div className="flex flex-col gap-1">
            <label className='text-sm leading-none font-medium pb-1'>
              Education
            </label>
            <select
              value={values.education ?? ''}
              onChange={(e) =>
                onChange({ education: e.target.value })
              }
              className={fieldClass}
            >
              <option value="">Select education</option>
              <option value="highschool">High school</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          {/* Occupation */}
          <div className="flex flex-col gap-1">
            <label className='text-sm leading-none font-medium pb-1'>
              Occupation
            </label>
            <input
              type="text"
              value={values.occupation ?? ''}
              onChange={(e) =>
                onChange({ occupation: e.target.value })
              }
              className={fieldClass}
              placeholder="e.g. Designer, Engineer"
            />
          </div>

          {/* Relationship status */}
          <div className="flex flex-col gap-1">
            <label className='text-sm leading-none font-medium pb-1'>
              Relationship status
            </label>
            <select
              value={values.relationshipStatus ?? ''}
              onChange={(e) =>
                onChange({
                  relationshipStatus: e.target.value,
                })
              }
              className={fieldClass}
            >
              <option value="">Select</option>
              <option value="single">Single</option>
              <option value="complicated">It’s complicated</option>
              <option value="open">Open</option>
            </select>
          </div>
        </div>

        {/* Pets */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h3 className="text-lg font-semibold text-neutral-800">
            Pets
          </h3>

          <div className="flex gap-8">
            {['dogs', 'cats', 'other'].map((pet) => (
              <label
                key={pet}
                className="flex items-center gap-2 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={values.pets.includes(pet)}
                  onChange={() => {
                    const next = values.pets.includes(pet)
                      ? values.pets.filter((p) => p !== pet)
                      : [...values.pets, pet]

                    onChange({ pets: next })
                  }}
                  className="w-5 h-5 accent-brand-500 cursor-pointer"
                />
                {pet}
              </label>
            ))}
          </div>
        </div>
      </div>
    </OnboardingLayout>
  )
}
