import { Outlet } from "react-router-dom"
import { Heart } from "lucide-react"


export default function PublicLayout() {
  const landing =
    import.meta.env.VITE_LANDING_URL?.replace(/\/+$/, "") ||
    "https://gemdating.framer.website/"

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          
          {/* LOGO → Framer */}
          <a href={landing} className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-brand-500 to-rose-400 p-1.5 rounded-lg">
              <Heart className="w-5 h-5 text-white fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              MatchApp
            </span>
          </a>

          {/* ENDA PUBLIC CTA */}
          {/* <Button asChild className="rounded-full">
            <a href={landing}>Home</a>
          </Button> */}
                <a
                href={landing}
                className="rounded-full px-4 py-2 hover:bg-gray-100 transition"
                >
                Home
                </a>
        </div>
      </nav>

      {/* SIDINNEHÅLL */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  )
}
