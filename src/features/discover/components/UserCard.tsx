// features/discover/components/UserCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Image, User } from "lucide-react"

interface Profile {
  id: string
  photo_urls: string[]
  about_you: {
    name?: string
    age?: number
  }
}

export function UserCard({ profile }: { profile: Profile }) {
  // Safe access to JSONB data
  const name = profile.about_you?.name || "Unknown"
  const age = profile.about_you?.age || ""
  const mainPhoto = profile.photo_urls?.[0]
  const photoCount = profile.photo_urls?.length || 0

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all border-none bg-secondary/20">
      <div className="relative aspect-[3/4]">
        {/* Main Image */}
        {mainPhoto ? (
          <img
            src={mainPhoto}
            alt={name}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <User className="w-12 h-12 text-muted-foreground" />
          </div>
        )}

        {/* Photo Count Badge */}
        {photoCount > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            <Image className="w-3 h-3" />
            {photoCount}
          </div>
        )}

        {/* Bottom Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h3 className="text-xl font-bold">
            {name}{age && `, ${age}`}
          </h3>
        </div>
      </div>
    </Card>
  )
}
