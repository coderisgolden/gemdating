export function SplashScreen() {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20" />
        <div className="relative h-12 w-12 text-primary">
          {/* Din ikon/logga här */}
          <svg
            xmlns="http://www.w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-full w-full"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">
        Laddar...
      </p>
    </div>
  )
}