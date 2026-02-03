import type { ReactNode } from 'react'
import { OnboardingFooter } from './OnboardingFooter'
import { Heart } from 'lucide-react'

type OnboardingLayoutProps = {
  title: string
  subtitle?: string
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
}

export function OnboardingLayout({
  title,
  subtitle,
  children,
  onBack,
  onNext,
  nextLabel,
  nextDisabled,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen flex  justify-center pt-16 bg-neutral-50">
      <div className="w-full max-w-3xl px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">

          <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-100 rounded-full mb-4">
            <Heart className="w-8 h-8 text-brand-500" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-semibold text-brand-700">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 text-bold-500">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div key={location.pathname} className="animate-fade-in">
          {children}
        </div>

        {/* Footer */}
        <OnboardingFooter
          onBack={onBack}
          onNext={onNext}
          nextLabel={nextLabel}
          nextDisabled={nextDisabled}
          // nextLabel={nextLabel}
        />
      </div>
    </div>
  )
}
