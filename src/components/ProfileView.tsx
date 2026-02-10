import { Heart, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import { PhotoCarousel } from "./PhotoCarousel.tsx"


interface ProfileViewProps {
  profile: any
  onBack: () => void
  onLike: (id: string) => void
  isLiking?: boolean // 👈 Ny prop för laddningsstatus
}

export function ProfileView({ profile, onBack, onLike, isLiking }: ProfileViewProps) {
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
<div className="p-4 sm:p-6 lg:p-8 flex flex-col">
  {/* HEADER */}
  <div className="mb-4 sm:mb-6 lg:mb-8">
    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
      {name}, {age}
    </h2>

    <div className="flex items-center gap-2 mt-2 text-gray-500">
      <span className="text-xs sm:text-sm font-medium bg-gray-100 px-2 sm:px-3 py-1 rounded-full">
        2 miles away
      </span>
    </div>
  </div>

  {/* PRIMARY ACTION */}
  <Button
    disabled={isLiking}
    onClick={() => onLike(profile.id)}
    className="
      w-full
      h-12 sm:h-14 lg:h-16
      rounded-full
      bg-gradient-to-r from-brand-500 to-rose-400
      text-white
      font-bold
      text-base sm:text-lg lg:text-xl
      shadow-lg
      transition-all
      active:scale-95
    "
  >
    {isLiking ? (
      <Loader2 className="mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 animate-spin" />
    ) : (
      <Heart className="mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 fill-current" />
    )}
    {isLiking ? "Matching..." : "Like Back"}
  </Button>

  {/* BACK BUTTON */}
  <Button
    onClick={onBack}
    variant="outline"
    className="
      w-full
      h-10 sm:h-11 lg:h-12
      rounded-full
      border-gray-300
      text-gray-700
      font-medium
      mt-3 sm:mt-4
      text-sm sm:text-base
      md:hidden
    "
  >
    Back to Likes
  </Button>

  {/* ABOUT */}
  <section className="space-y-4 sm:space-y-5 lg:space-y-6 mt-6 sm:mt-7 lg:mt-8">
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
        About
      </h4>
      <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
        {bio}
      </p>
    </div>
  </section>
</div>
      </div>
    </div>
  )
}
