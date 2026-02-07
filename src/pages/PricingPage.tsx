import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const tiers = [
  {
    name: 'Free',
    price: '0 kr',
    description: 'Perfekt för att börja utforska.',
    features: [
      'Se 10 profiler per dag',
      'Matcha och chatta gratis',
      'Ladda upp 3 bilder',
    ],
    notIncluded: [
      'Direktmeddelanden utan match',
      'Se vem som gillar dig',
      'Prioriterad synlighet',
    ],
    buttonText: 'Fortsätt gratis',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '149 kr',
    period: '/månad',
    description: 'Vårt mest populära val för seriösa dejtare.',
    features: [
      'Obegränsat med profilvisningar',
      '5 Direktmeddelanden per dag (utan match)',
      'Se alla som gillar dig',
      'Ingen reklam',
      'Ladda upp 10 bilder',
    ],
    buttonText: 'Skaffa Premium',
    highlight: true,
    badge: 'Mest populär',
  },
  {
    name: 'Elite',
    price: '299 kr',
    period: '/månad',
    description: 'För dig som vill ha det absolut bästa.',
    features: [
      'Allt i Premium',
      'Obegränsat med Direktmeddelanden',
      'Top-placering i andras flöden',
      'Verifierad Elite-badge på profilen',
      'Personlig profil-coach',
    ],
    buttonText: 'Bli Elite',
    highlight: false,
  },
]

export function PricingPage() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-base font-semibold text-brand-600 uppercase tracking-wide">Medlemskap</h2>
        <p className="mt-2 text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Hitta din perfekta match snabbare
        </p>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Välj den nivå som passar dina behov och börja skicka meddelanden direkt.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {tiers.map((tier) => (
          <Card 
            key={tier.name} 
            className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-xl ${
              tier.highlight 
                ? 'border-brand-500 border-2 scale-105 shadow-lg z-10 bg-white' 
                : 'border-gray-200 bg-gray-50/50'
            }`}
          >
            {tier.badge && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Badge className="bg-brand-500 hover:bg-brand-600 px-4 py-1 text-sm uppercase">
                  {tier.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-bold">{tier.name}</CardTitle>
              <CardDescription className="min-h-[40px] mt-2">
                {tier.description}
              </CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                {tier.period && <span className="text-gray-500 font-medium">{tier.period}</span>}
              </div>
            </CardHeader>

            <CardContent className="flex-grow">
              <ul className="space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 shrink-0 mr-3" />
                    <span className="text-sm text-gray-700 font-medium">{feature}</span>
                  </li>
                ))}
                {tier.notIncluded?.map((feature) => (
                  <li key={feature} className="flex items-start opacity-40">
                    <Check className="h-5 w-5 text-gray-400 shrink-0 mr-3" />
                    <span className="text-sm text-gray-500 line-through italic">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="pb-8 pt-4">
              <Button 
                className={`w-full h-12 rounded-full font-bold text-lg ${
                  tier.highlight 
                    ? 'bg-gradient-to-r from-brand-500 to-rose-400 hover:from-brand-600 hover:to-rose-500 text-white shadow-md' 
                    : 'bg-white text-gray-900 border-2 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tier.buttonText}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Extra Trust Section */}
      <div className="mt-20 flex flex-wrap justify-center gap-12 text-center grayscale opacity-50">
        <div className="flex flex-col items-center">
          <ShieldCheck className="h-10 w-10 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">Säker betalning</span>
        </div>
        <div className="flex flex-col items-center">
          <Zap className="h-10 w-10 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">Snabb aktivering</span>
        </div>
        <div className="flex flex-col items-center">
          <Sparkles className="h-10 w-10 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">Inga dolda avgifter</span>
        </div>
      </div>
    </div>
  )
}
