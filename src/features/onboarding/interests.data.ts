import { Palette, Coffee, Plane } from 'lucide-react'
import type { Interest } from './types'

export const INTERESTS: Interest[] = [
  {
    id: 'art',
    title: 'Art & Design',
    icon: Palette,
    description: 'Explore creativity and visual aesthetics',
  },
  {
    id: 'coffee',
    title: 'Coffee Culture',
    icon: Coffee,
    description: 'Discover artisan brews and café vibes',
  },
  {
    id: 'travel',
    title: 'Travel & Adventure',
    icon: Plane,
    description: 'Journey to new destinations worldwide',
  },
]
