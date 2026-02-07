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
    <div className="min-h-screen flex  justify-center pt-16">
      <div className="w-full max-w-3xl px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="bg-gradient-to-br from-brand-500 to-rose-400 p-1.5 rounded-lg inline-block mb-4 ">
           <div className="bg-gradient-to-br from-brand-500 to-rose-400 p-1.5 rounded-lg">
                <Heart className="w-5 h-5 text-white fill-current" />
            </div>
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
