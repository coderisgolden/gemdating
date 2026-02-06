import { useState } from 'react'
import { OnboardingLayout } from '../components/OnboardingLayout'
import { Heart, Users, MapPin, MessageCircle } from 'lucide-react'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export type DealbreakersLifestyleValues = {
  smoking?: string
  drinking?: string
  children?: string
  pets?: string
  distance?: string
  additional?: string
}

type DealbreakersLifestyleStepProps = {
  values: DealbreakersLifestyleValues
  onChange: (patch: Partial<DealbreakersLifestyleValues>) => void
  onContinue: () => void
  onBack: () => void
}

export function DealbreakersLifestyleStep({
  values,
  onChange,
  onContinue,
  onBack,
}: DealbreakersLifestyleStepProps) {
  const [showError, setShowError] = useState(false)

  const isValid =
    !!values.smoking ||
    !!values.drinking ||
    !!values.children ||
    !!values.pets ||
    !!values.distance ||
    !!values.additional

  function handleNext() {
    if (!isValid) {
      setShowError(true)
      return
    }
    onContinue()
  }

  return (
    <OnboardingLayout
      title="Your Dealbreakers"
      subtitle="Help us find your perfect match by selecting what matters most to you."
      onBack={onBack}
      onNext={handleNext}
    >
      <div
        className={[
          ' space-y-8 transition',
          showError && !isValid ? 'animate-shake' : '',
        ].join(' ')}
      >
        {showError && !isValid && (
          <p className="text-md text-red-500">
            Please select at least one preference before continuing.
          </p>
        )}

        {/* Lifestyle */}
        <div className="bg-white  rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-brand-100 rounded-full p-2">
              <Heart className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              Lifestyle Preferences
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3">
              <Label>Smoking</Label>
              <RadioGroup
                value={values.smoking}
                onValueChange={(v) => onChange({ smoking: v })}
                className="flex flex-wrap gap-3"
              >
                {[
                  ['no-preference', 'No Preference'],
                  ['non-smoker', 'Must be Non-Smoker'],
                  ['smoker-ok', 'Smoker is OK'],
                ].map(([val, label]) => (
                  <Label
      key={val}
      htmlFor={val}
      className="flex items-center space-x-2 shadow-sm bg-white rounded-full px-4 py-2 cursor-pointer"
    >
      <RadioGroupItem id={val} value={val} />
      <span>{label}</span>
    </Label>
                ))}
              </RadioGroup>
            </div>

            <div className="grid gap-3">
              <Label>Drinking</Label>
              <RadioGroup
                value={values.drinking}
                onValueChange={(v) => onChange({ drinking: v })}
                className="flex flex-wrap gap-3"
              >
                {[
                  ['no-preference', 'No Preference'],
                  ['non-drinker', 'Non-Drinker Only'],
                  ['social', 'Social Drinker OK'],
                ].map(([val, label]) => (
                  <Label
      key={val}
      htmlFor={val}
      className="flex items-center space-x-2 shadow-sm bg-white rounded-full px-4 py-2 cursor-pointer"
    >
      <RadioGroupItem id={val} value={val} />
      <span>{label}</span>
    </Label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </div>

        {/* Family */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-brand-100 rounded-full p-2">
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              Family & Future
            </h3>
          </div>

          <RadioGroup
            value={values.children}
            onValueChange={(v) => onChange({ children: v })}
            className="flex flex-wrap gap-3 mb-4"
          >
            {[
              ['open', 'Open to Either'],
              ['want', 'Want Children'],
              ['no-children', "Don't Want Children"],
            ].map(([val, label]) => (
              <Label
      key={val}
      htmlFor={val}
      className="flex items-center space-x-2 shadow-sm bg-white rounded-full px-4 py-2 cursor-pointer"
    >
      <RadioGroupItem id={val} value={val} />
      <span>{label}</span>
    </Label>
            ))}
          </RadioGroup>

          <RadioGroup
            value={values.pets}
            onValueChange={(v) => onChange({ pets: v })}
            className="flex flex-wrap gap-3"
          >
            {[
              ['pets-open', 'No Preference'],
              ['love-pets', 'Must Love Pets'],
              ['no-pets', 'No Pets Please'],
            ].map(([val, label]) => (
              <Label
      key={val}
      htmlFor={val}
      className="flex items-center space-x-2 shadow-sm bg-white rounded-full px-4 py-2 cursor-pointer"
    >
      <RadioGroupItem id={val} value={val} />
      <span>{label}</span>
    </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Distance */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-brand-100 rounded-full p-2">
              <MapPin className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              Location & Distance
            </h3>
          </div>

          <Select
            value={values.distance}
            onValueChange={(v) => onChange({ distance: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select maximum distance" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
                <SelectItem value="50">Within 50 miles</SelectItem>
                <SelectItem value="100">Within 100 miles</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Additional */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-brand-100 rounded-full p-2">
              <MessageCircle className="w-5 h-5 text-brand-600" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">
              Additional Dealbreakers
            </h3>
          </div>

          <Textarea
            value={values.additional ?? ''}
            onChange={(e) =>
              onChange({ additional: e.target.value })
            }
            placeholder="Share any other important preferences or dealbreakers..."
            className="min-h-[120px] resize-none"
          />
        </div>
      </div>
    </OnboardingLayout>
  )
}
