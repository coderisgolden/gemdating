import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

type PhotoCarouselProps = {
  urls: string[]
  name: string
}

// Hjälpkomponent för Carousel med pilar och bullets
export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({ urls, name }) => {
  const [api, setApi] = React.useState<CarouselApi | undefined>(undefined)
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
  }, [api]) // beroende ENDAST api (som du ville)

  return (
    /* VIKTIGT: h-full här ärver höjden från förälderns kolumn */
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

      {/* Bullets */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {[...Array(count)].map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full ${
              current === index + 1 ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
