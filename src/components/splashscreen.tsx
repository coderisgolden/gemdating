import { Heart, } from "lucide-react"

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      {/* Logga eller Spinner */}
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500" />
        <Heart className="absolute inset-0 m-auto h-6 w-6 text-brand-500 animate-pulse" />
      </div>
      
      <h2 className="mt-4 text-xl font-bold bg-gradient-to-r from-brand-500 to-rose-400 bg-clip-text text-transparent italic">
        MatchApp
      </h2>
    </div>
  )
}
