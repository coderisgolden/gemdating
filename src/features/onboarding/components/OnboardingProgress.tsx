type OnboardingProgressProps = {
  currentStep: number
  totalSteps: number
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
}: OnboardingProgressProps) {
  const percentage =
    ((currentStep + 1) / totalSteps) * 100

  return (
    <div className="w-full max-w-2xl mx-auto  mb-8 px-4">
      <div className="flex justify-between items-center mb-2 text-sm text-gray-600">
        <span className="font-semibold">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>

      <div className="h-2 w-full bg-brand-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-400 to-brand-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
