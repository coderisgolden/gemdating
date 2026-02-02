type OnboardingFooterProps = {
  onBack?: () => void
  onNext?: () => void
  nextDisabled?: boolean
  nextLabel?: string
}

export function OnboardingFooter({
  onBack,
  onNext,
  nextDisabled,
  nextLabel
}: OnboardingFooterProps) {
  return (
    <div className="mt-12 flex justify-between items-center">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="text-md text-neutral-600 hover:text-neutral-900 underline"
        >
          Back
        </button>
      ) : (
        <div />
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={[
            'px-6 py-2 rounded-md text-sm font-medium transition',
            nextDisabled
              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              : 'bg-neutral-900 text-white hover:bg-neutral-800',
          ].join(' ')}
        >
          {nextLabel ?? 'Next'}
        </button>
      )}
    </div>
  )
}
