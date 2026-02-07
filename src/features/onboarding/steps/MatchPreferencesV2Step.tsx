import { useState } from 'react'
import { OnboardingLayout } from '../components/OnboardingLayout'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { User, Sparkles, Smile, MessageCircle } from 'lucide-react'

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

type MatchPreferencesV2StepProps = {
  values: MatchPreferencesV2Values
  onChange: (patch: Partial<MatchPreferencesV2Values>) => void
  onContinue: () => void
  onBack: () => void
}

export function MatchPreferencesV2Step({
  values,
  onChange,
  onContinue,
  onBack,
}: MatchPreferencesV2StepProps) {
  const [showError, setShowError] = useState(false)

  // const isValid =
  //   !!values.ageRange ||
  //   !!values.distance ||
  //   !!values.interestedIn ||
  //   values.relationshipTypes.length > 0 ||
  //   !!values.education ||
  //   !!values.lifestyle ||
  //   values.interests.length > 0 ||
  //   !!values.religion ||
  //   !!values.smoking ||
  //   !!values.drinking ||
  //   !!values.children ||
  //   !!values.notes

const isValid = !!values.interestedIn
  

  function handleNext() {
    if (!isValid) {
      setShowError(true)
      return
    }
    onContinue()
  }

  function toggleArrayValue(
    key: 'relationshipTypes' | 'interests',
    value: string
  ) {
    const current = values[key]
    onChange({
      [key]: current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    })
  }

  return (
    <OnboardingLayout
      title="Match Preferences"
      subtitle="Find your perfect match by setting your preferences"
      onBack={onBack}
      onNext={handleNext}
    >
      <div
        className={[
          'max-w-4xl mx-auto space-y-8 transition',
          showError && !isValid ? 'animate-shake' : '',
        ].join(' ')}
      >
        {showError && !isValid && (
          <p className="text-md text-red-500">
            Please select if you are interested in women, men, or anyone.
          </p>
        )}

        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">

            <div className="bg-brand-100 rounded-full p-2">
              <User
              className="w-5 h-5"
              style={{ color: 'var(--color-brand-600)' }}
            />
            </div>
            
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className='pb-2'>Age Range</Label>
              <Select
                value={values.ageRange}
                onValueChange={(v) => onChange({ ageRange: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent className="bg-popover text-popover-foreground">
                  <SelectGroup>
                    <SelectItem value="18-25">18 - 25</SelectItem>
                    <SelectItem value="26-35">26 - 35</SelectItem>
                    <SelectItem value="36-45">36 - 45</SelectItem>
                    <SelectItem value="46-55">46 - 55</SelectItem>
                    <SelectItem value="56+">56+</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className='pb-2'>Distance</Label>
              <Select
                value={values.distance}
                onValueChange={(v) => onChange({ distance: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="5">5 miles</SelectItem>
                    <SelectItem value="10">10 miles</SelectItem>
                    <SelectItem value="25">25 miles</SelectItem>
                    <SelectItem value="50">50 miles</SelectItem>
                    <SelectItem value="100">100 miles</SelectItem>
                    <SelectItem value="any">Any</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <Label>Interested In</Label>
            <RadioGroup
              value={values.interestedIn}
              onValueChange={(v) => onChange({ interestedIn: v })}
              className="flex gap-4 flex-wrap mt-2"
            >
              {['women', 'men', 'anyone'].map((v) => (
                <Label
      key={v}
      htmlFor={v}
      className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm cursor-pointer"
    >
      <RadioGroupItem id={v} value={v} />
      <span className="w-12 h-5">{v}</span>
    </Label>
              ))}
            </RadioGroup>
          </div>
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <div className="bg-brand-100 rounded-full p-2">
              <Sparkles
              className="w-5 h-5"
              style={{ color: 'var(--color-brand-600)' }}
            />
            </div>
            
            Lifestyle Preferences
          </h2>

          <Label>Relationship Type</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {['casual', 'serious', 'friendship', 'marriage'].map((v) => (
              <div
                key={v}
                className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm"
              >
                <Checkbox className='w-5 h-5'
                  checked={values.relationshipTypes.includes(v)}
                  onCheckedChange={() =>
                    toggleArrayValue('relationshipTypes', v)
                  }
                />
                <Label>{v}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Interests & Values */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <div className="bg-brand-100 rounded-full p-2">
              <Smile
              className="w-5 h-5"
              style={{ color: 'var(--color-brand-600)' }}
            />
            </div>
            
            
            Interests & Values
          </h2>

          <Label>Interests</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            {[
              'music',
              'travel',
              'sports',
              'cooking',
              'reading',
              'art',
              'fitness',
              'movies',
            ].map((v) => (
              <div
                key={v}
                className="flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-sm"
              >
                <Checkbox className='w-5 h-5'
                  checked={values.interests.includes(v)}
                  onCheckedChange={() =>
                    toggleArrayValue('interests', v)
                  }
                />
                <Label>{v}</Label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Notes */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">

            <div className="bg-brand-100 rounded-full p-2">
              <MessageCircle
              className="w-5 h-5"
              style={{ color: 'var(--color-brand-600)' }}
            />
            </div>
            
            Additional Notes
          </h2>

          <Textarea
            value={values.notes ?? ''}
            onChange={(e) => onChange({ notes: e.target.value })}
            placeholder="Share any additional preferences..."
            className="min-h-[120px]"
          />
        </div>
      </div>
    </OnboardingLayout>
  )
}
