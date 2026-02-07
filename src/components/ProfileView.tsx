import { Heart, MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { PhotoCarousel } from "./PhotoCarousel.tsx"


interface ProfileViewProps {
  profile: any
  onLike: (id: string) => void
  isLiking?: boolean // 👈 Ny prop för laddningsstatus
}

export function ProfileView({ profile, onLike, isLiking }: ProfileViewProps) {
  if (!profile) return null;

  const name = profile.about_you?.name || "Anonymous"
  const age = profile.about_you?.age || "?"
  const bio = profile.about_you?.bio || "No bio yet."
  const photos = profile.photo_urls || []

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] min-h-full">
        {/* BILDER */}
        <div className="p-6 bg-gray-50 border-r flex justify-center items-start">
          <div className="w-full aspect-[3/4] max-w-[500px] sticky top-0">
            <PhotoCarousel urls={photos} name={name} />
          </div>
        </div>

        {/* INFO */}
        <div className="p-8 flex flex-col">
          <div className="mb-8">
            <h2 className="text-4xl font-black">{name}, {age}</h2>
            <div className="flex items-center gap-2 mt-2 text-gray-500">
               <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">2 miles away</span>
            </div>
          </div>

          <Button 
              disabled={isLiking} // 👈 Inaktivera knappen under laddning
              onClick={() => onLike(profile.id)}
              className="w-full h-16 rounded-full bg-gradient-to-r from-brand-500 to-rose-400 text-white font-bold text-xl shadow-lg transition-all active:scale-95"
            >
              {isLiking ? (
                <Loader2 className="mr-3 h-7 w-7 animate-spin" /> // 👈 Visa spinnern
              ) : (
                <Heart className="mr-3 h-7 w-7 fill-current" />
              )}
              {isLiking ? "Matching..." : "Like Back"}
          </Button>
          <section className="space-y-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">About</h4>
              <p className="text-gray-700 leading-relaxed text-lg">{bio}</p>
            </div>
            {/* Här kan du lägga till Interests senare om du vill */}
          </section>
        </div>
      </div>
    </div>
  )
}
