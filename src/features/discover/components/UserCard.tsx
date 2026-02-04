// features/discover/components/UserCard.tsx

// Importera nödvändiga komponenter från Shadcn UI
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Image, User,  Heart, ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button" // För Like-knappen
// import  { CarouselApi } from "@/components/ui/carousel"

import * as React from 'react'; // Behövs för useState och useEffect i modalen

// ... (Interface Profile och interestsArray-logiken från tidigare steg) ...
interface Profile {
  id: string;
  photo_urls: string[];
  interests: string[] | string; // Kan vara string eller array beroende på gamla/nya data
  about_you: {
    name?: string;
    age?: number;
    bio?: string;
  };
  dealbreakers_lifestyle: {
    smoking?: string;
    drinking?: string;
    children?: string;
    pets?: string;
  };
}


export function UserCard({ profile }: { profile: Profile }) {
  const name = profile.about_you?.name || "Unknown"
  const age = profile.about_you?.age || ""
  const mainPhoto = profile.photo_urls?.[0]
  const photoCount = profile.photo_urls?.length || 0

  // Logik för att hantera gamla "stringifyade" interests
  let interestsArray: string[] = [];
  try {
    if (Array.isArray(profile.interests)) {
      interestsArray = profile.interests;
    } else if (typeof profile.interests === 'string') {
      const parsed = JSON.parse(profile.interests);
      interestsArray = Array.isArray(parsed) ? parsed : [];
    }
  } catch (e) {
    interestsArray = [];
  }
  

  return (
    <Dialog>
       <DialogTrigger asChild>
        <Card className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all border-none bg-secondary/20 relative">
          <div className="relative aspect-3/4">
            {/* Använder mainPhoto här */}
            {mainPhoto ? (
              <img src={mainPhoto} alt={name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <User className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            
            {/* Använder photoCount här */}
            {photoCount > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 z-10">
                <Image className="w-3 h-3" /> {photoCount}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
              <h3 className="text-2xl font-bold tracking-tight">{name}{age && `, ${age}`}</h3>
            </div>
          </div>
        </Card>
      </DialogTrigger>

      {/* MODALEN STARTAR HÄR */}
<DialogContent className="fixed z-overlay bg-white flex flex-col overflow-hidden transition-all duration-[350ms] ease-out will-change-transform
  inset-0
  md:left-1/2 md:top-1/2
  md:-translate-x-1/2 md:-translate-y-1/2
  md:w-full md:max-w-[1200px]
  md:h-[90vh]
  md:max-h-[900px]
  md:rounded-lg md:shadow-2xl
  p-0">  
        
        {/* Scrollbar wrapper */}
        <div className="overflow-y-auto overflow-x-hidden h-full">
          
          {/* Grid layout */}
          <div className="grid md:grid-cols-[1fr_400px] gap-0"> 
          
            {/* VÄNSTER KOLUMN: Carousel - ABSOLUT FAST HÖJD */}
           {/* VÄNSTER KOLUMN */}
<div className="relative p-4 md:p-6 flex-shrink-0">
  <div className="w-full aspect-[3/4] max-h-[800px] mx-auto md:max-h-[800px]">
    {profile.photo_urls && profile.photo_urls.length > 0 ? (
      <PhotoCarousel urls={profile.photo_urls} name={name} />
    ) : (
      <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
        <User className="w-20 h-20 text-muted-foreground" />
      </div>
    )}
  </div>
</div>


            {/* HÖGER KOLUMN: Information */}
            <div className="p-4 md:p-6 space-y-6 md:border-l md:border-gray-400">
              <DialogHeader>
                <DialogTitle className="text-3xl font-extrabold flex justify-between items-center">
                  {name}, {age}
                  <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Heart className="h-5 w-5" />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-10">
                <section>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><User className="w-4 h-4" /> Om mig</h4>
                  <p className="text-sm leading-relaxed">{profile.about_you?.bio || "Ingen beskrivning ännu."}</p>
                </section>

                {interestsArray.length > 0 && (
                  <section>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-2"><Heart className="w-4 h-4" /> Intressen</h4>
                    <div className="flex flex-wrap gap-2">
                      {interestsArray.map((interest: string) => (
                        <Badge key={interest} variant="secondary" className="px-5 py-2 rounded-full bg-brand-300">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </section>
                )}
                
                <section className="bg-gray-50 px-2 py-2">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Dealbreakers</h4>
                  <div className="text-sm space-y-1">
                      <p>Rökning: {profile.dealbreakers_lifestyle?.smoking || 'Oklart'}</p>
                      <p>Barn: {profile.dealbreakers_lifestyle?.children || 'Oklart'}</p>
                  </div>
                </section>

              </div>
            </div>
          </div>
        </div>
      </DialogContent>

 
    </Dialog>
  )
}


// Hjälpkomponent för Carousel med pilar och bullets
const PhotoCarousel = ({ urls, name }: { urls: string[], name: string }) => {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    React.useEffect(() => {
        if (!api) return

        // FIXAT: Använder api.scrollSnapList().length som är korrekt för TypeScript
        setCount(api.scrollSnapList().length) 
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api]) // Beroendet är bara api

    return (
     /* VIKTIGT: h-full här ärver höjden från förälderns kolumn (500px/550px) */
     <div className="relative w-full h-full overflow-hidden rounded-lg">
      <Carousel setApi={setApi} className="w-full h-full">
        {/* CarouselContent måste ha h-full */}
        <CarouselContent className="h-full ml-0"> 
          {urls.map((url, index) => (
            <CarouselItem
              key={index}
              /* basis-full och h-full ser till att itemet tar upp hela ytan */
              className="h-full basis-full pl-0"
            >
              <div className="w-full h-full">
                <img
                  src={url}
                  alt={`${name} ${index + 1}`}
                  /* object-cover klipper bilden så den fyller ut containern perfekt */
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[...Array(count)].map((_, index) => (
          <div key={index} className={`h-2 w-2 rounded-full ${current === index + 1 ? "bg-white" : "bg-white/50"}`} />
        ))}
      </div>
    </div>
    )
}