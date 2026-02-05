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
import { Image, User,  Heart, } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button" // För Like-knappen
import { supabase } from "@/lib/supabase"
import {useState } from "react"
import { MatchModal } from "@/components/MatchModal"
import { useNavigate } from 'react-router-dom';


import * as React from 'react'; // Behövs för useState och useEffect i modalen


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

interface UserCardProps {
  profile: Profile;
  currentUserPhoto: string | null;
}






export function UserCard({ profile,  currentUserPhoto }: UserCardProps) {
  const name = profile.about_you?.name || "Unknown"
  const age = profile.about_you?.age || ""
  const mainPhoto = profile.photo_urls?.[0]
  const photoCount = profile.photo_urls?.length || 0
  const [open, setOpen] = useState(false); 
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [matchData, setMatchData] = useState<{ isMatch: boolean; matchId: string } | null>(null);
   const navigate = useNavigate();
  

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



  //Handelike function
  const handleLike = async () => {
    const { data, error } = await supabase.rpc('handle_like', { 
      target_user_id: profile.id 
    });

    if (error) return;
    setMatchData(data);

    if (data.isMatch) {
      setOpen(false); // 👈 Detta stänger nu Dialogen tack vare 'open={open}' nedan
      setShowMatchModal(true);
    } else {
      setOpen(false);
    }
  };


const onSendMessage = () => {

  alert("Funktionen onSendMessage körs!"); // Kommer denna upp?
  console.log("Match ID:", matchData?.matchId);
  if (matchData?.matchId) {
    // Stäng alla fönster först
    setShowMatchModal(false);
    setOpen(false); 
    
    // Navigera i React Router
    navigate(`/chat?matchId=${matchData.matchId}`);
  }
};

  

  return (

    <>  


  <Dialog open={open} onOpenChange={setOpen}>
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
        <DialogContent className="/* Mobil: Fullskärm och nollställ centrering */
          fixed inset-0 translate-x-0 translate-y-0 max-w-none h-full w-full rounded-none border-none p-0
          
          /* Desktop (md och uppåt): Centrerad box */
          md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 
          md:w-full md:max-w-[1200px] md:h-[90vh] md:max-h-[900px] 
          md:rounded-lg md:border md:shadow-2xl md:p-0">
                
          {/* Scrollbar wrapper */}
          <div className="overflow-y-auto overflow-x-hidden h-full">
            
            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-0"> 
            
              {/* VÄNSTER KOLUMN: Carousel */}
              <div className="relative p-4 md:p-6 flex-shrink-0">
                <div className="w-full aspect-[3/4] max-h-[600px] md:max-h-[800px] mx-auto">
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
      <div className="flex flex-col md:border-l md:border-gray-200">
        
        {/* Header sektion */}
        <div className="p-6 pb-4">
  <DialogHeader className="space-y-4">
    <div className="flex  justify-between items-start gap-4">
      
      <div className="flex flex-col items-start space-y-4 flex-1 min-w-0"> {/* min-w-0 behövs för att text-wrap ska fungera i flex */}
        <DialogTitle className="text-3xl md:text-4xl font-extrabold leading-tight break-words text-black">
          {name}
        </DialogTitle>
        <div className="">
        <p className="text-md md:text-2xl font-medium text-gray-600 mt-1">
          {age} år
        </p>
        </div>
      </div>

      {/* Like-knapp sektion */}
     
    </div>

    {/* Avstånd/Location */}
    <div className="flex items-center gap-1.5 text-muted-foreground bg-gray-50 self-start px-3 py-1 rounded-full border border-gray-100">
      <svg className="w-4 h-4 text-brand-500" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
      <span className="text-sm font-medium">2 miles away</span>
    </div>
  </DialogHeader>
</div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto">

          {/* Like */}
          <section className="px-6 py-5 border-t border-gray-100">
             <div className=" flex items-center space-x-4 flex-shrink-0">
                  <Button 
                  onClick={handleLike} 
                    size="lg"
                    className="rounded-full h-14 w-14 bg-gradient-to-br from-brand-500 to-rose-400 hover:scale-110 transition-transform shadow-lg border-none"
                  >
                    <Heart className="h-7 w-7 text-white fill-current" />
                  </Button>

                  <p className="text-md text-rose-500 text-gray-600 mt-2">Like this profile</p>
              </div>
            
          </section>
          
          {/* ABOUT ME sektion */}
          <section className="px-6 py-5 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              ABOUT ME
            </h4>
            <p className="text-sm leading-relaxed text-gray-800">
              {profile.about_you?.bio || "Ingen beskrivning ännu."}
            </p>
          </section>

          {/* INTERESTS sektion */}
          {interestsArray.length > 0 && (
            <section className="px-6 py-5 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                INTERESTS
              </h4>
              <div className="flex flex-wrap gap-2">
                {interestsArray.map((interest: string) => (
                  <Badge 
                    key={interest} 
                    className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* DETAILS sektion */}
          <section className="px-6 py-5 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              DETAILS
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-800">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <span>Marketing Professional</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-800">
                <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                <span>Looking for: Long-term relationship</span>
              </div>
            </div>
          </section>

          {/* Dealbreakers sektion (optional) */}
          {(profile.dealbreakers_lifestyle?.smoking || profile.dealbreakers_lifestyle?.children) && (
            <section className="px-6 py-5 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                DEALBREAKERS
              </h4>
              <div className="space-y-2 text-sm text-gray-800">
                {profile.dealbreakers_lifestyle?.smoking && (
                  <p>Rökning: {profile.dealbreakers_lifestyle.smoking}</p>
                )}
                {profile.dealbreakers_lifestyle?.children && (
                  <p>Barn: {profile.dealbreakers_lifestyle.children}</p>
                )}
              </div>
            </section>
          )}

        </div>

        {/* Footer med Send Message knapp */}
        <div className="p-6 pt-4 border-t border-gray-100 bg-gradient-to-r from-brand-500 to-pink-500">
          <div className="mb-3">
            <p className="text-white text-sm font-medium flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
              </svg>
              Send Instant Message
            </p>
          </div>
          <Button 
            variant="outline" 
            className="w-full bg-white text-brand-600 hover:bg-gray-50 font-semibold py-6 rounded-full border-0 text-base"
          >
            Send Message
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Button>
        </div>

      </div>
    </div>
  </div>
</DialogContent>
</Dialog>

<MatchModal 
      isOpen={showMatchModal}
      onClose={() => setShowMatchModal(false)}
      currentUserPhoto={currentUserPhoto} // Din egen bild (från auth/context)
      matchedUserPhoto={profile.photo_urls[0]} // Den andras bild
      matchedUserName={name}
      onSendMessage={onSendMessage}
      
    />

</>


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