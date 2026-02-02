import type { Interest } from '../types'

type InterestCardProps = {
  interest: Interest
  selected: boolean
  onToggle: (id: string) => void
}

export function InterestCard({
  interest,
  selected,
  onToggle,
}: InterestCardProps) {
  const Icon = interest.icon

  return (
    <button
      type="button"
      onClick={() => onToggle(interest.id)}
      className={[
        'group relative bg-white rounded-3xl p-6 shadow-md transition-all duration-300 text-left',
        selected
          ? 'border-2 border-brand-400 shadow-xl bg-brand-50'
          : 'border-2 border-transparent hover:border-brand-200 hover:shadow-xl ',
      ].join(' ')}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-br from-brand-200 to-rose-200 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <Icon className="w-8 h-8 text-brand-400" />
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">
            {interest.title}
          </h3>

          {interest.description && (
            <p className="text-sm text-gray-500">
              {interest.description}
            </p>
          )}
        </div>
      </div>
    </button>
  )
}
