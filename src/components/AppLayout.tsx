import { Link, useNavigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { supabase } from "@/lib/supabase"
import { useEffect, useState} from "react"
import { 
  MessageSquare, 
  Search, 
  LogOut, 
  
  Heart
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"


interface MessagePayload {
  id: string;
  is_read: boolean;
  sender_id: string;
}

export default function AppLayout() {

const [hasNewLikes, setHasNewLikes] = useState(false);


  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()


  // const handleLogout = async () => {
  //   await supabase.auth.signOut()
  //   window.location.href = import.meta.env.VITE_LANDING_URL
  // }

//   const handleLogout = async () => {
//   const landing =
//     import.meta.env.VITE_LANDING_URL?.replace(/\/+$/, "") ||
//     "https://gemdating.vercel.app"

//   // Redirecta DIREKT – innan React hinner rerendra
//   window.location.replace(landing)

//   // Logga ut i bakgrunden
//   await supabase.auth.signOut()
// }

const handleLogout = async () => {
  await supabase.auth.signOut()

  // const landing =
  //   import.meta.env.VITE_LANDING_URL?.replace(/\/+$/, "") ||
  //   "https://gemdating.vercel.app"

  // window.location.replace(landing)
}



  // Hämta första bokstaven i e-posten för avataren
  const userInitial = user?.email?.charAt(0).toUpperCase() || "U"
  const [unreadCount, setUnreadCount] = useState(0)

// REALTIME: Lyssna på nya meddelanden och uppdatera unread count
  useEffect(() => {
  if (!user) return

  const getUnread = async () => {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false)
      .neq('sender_id', user.id)

    setUnreadCount(count || 0)
  }
  getUnread()

  const channel = supabase
  .channel('unread-messages')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'messages' }, 
    (payload) => {
      console.log("REALTIME EVENT MOTTAGET:", payload);
      const oldMsg = payload.old as MessagePayload;
      const newMsg = payload.new as MessagePayload;
       if (oldMsg.is_read === false && newMsg.is_read === true) {
      setUnreadCount(prev => Math.max(0, prev - 1))
    }
    }
  )
  .subscribe((status) => {
    console.log("REALTIME STATUS:", status); // Denna bör skriva 'SUBSCRIBED'
  });

  return () => { supabase.removeChannel(channel) }
}, [user])



// REALTIME: Lyssna på nya likes och uppdatera hasNewLikes
useEffect(() => {
  if (!user?.id) return;

  // 1. Kolla om det finns några obesvarade likes när sidan laddas
  const checkLikes = async () => {
    const { data } = await supabase
      .from('likes')
      .select('id')
      .eq('to_user_id', user.id)
      .is('is_matched', false) // Bara de som inte matchat än
      .limit(1);
    
    if (data && data.length > 0) setHasNewLikes(true);
  };
  checkLikes();

  // 2. Lyssna live på när NYA likes trillar in
  const likesChannel = supabase
    .channel('navbar-likes')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'likes', filter: `to_user_id=eq.${user.id}` }, 
      () => {
        setHasNewLikes(true);
      }
    )
    .subscribe();

  return () => { supabase.removeChannel(likesChannel) };
}, [user?.id]);






  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          
          {/* VÄNSTER: Logo och Nav-länkar */}
          <div className="flex items-center gap-8">
            <Link to="/app" className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-brand-500 to-rose-400 p-1.5 rounded-lg">
                <Heart className="w-5 h-5 text-white fill-current" />
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">MatchApp</span>
            </Link>

            <div className="flex items-center gap-1">
              <Button 
                variant={location.pathname === "/app" ? "secondary" : "ghost"} 
                asChild
                className="rounded-full gap-2"
              >
                <Link to="/app">
                  <Search className="w-4 h-4" />
                  <span>Discover</span>
                </Link>
              </Button>

              <Button 
                  variant={location.pathname === "/chat" ? "secondary" : "ghost"} 
                  asChild
                  className="rounded-full gap-2 relative" 
                >
                  <Link to="/chat">
                    <div className="relative">
                  <MessageSquare className="w-6 h-6" /> {/* Lite större ikon hjälper balansen */}
                  
                  {unreadCount > 0 && (
                    <div className="absolute -top-2 -right-2 flex items-center justify-center">
                      {/* Pingen ligger underst */}
                      <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      
                      {/* Siffran ligger överst - VIKTIGT med flex och leading-none */}
                      <span className="relative flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[11px] font-bold text-white border-2 border-white leading-none">
                        {unreadCount > 9 ? '9' : unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                    <span className="hidden sm:block font-medium">Chat</span>
                  </Link>
            </Button>

            <Button 
                variant={location.pathname === "/likes" ? "secondary" : "ghost"} 
                asChild
                className="rounded-full gap-2 relative" 
              >
                <Link to="/likes" onClick={() => setHasNewLikes(false)}> {/* Nollställ vid klick */}
                  <div className="relative">
                    <Heart className="w-6 h-6 text-brand-500" /> 
                    
                    {hasNewLikes && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white shadow-sm"></span>
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block font-medium">Likes</span>
                </Link>
          </Button>


            </div>
          </div>

          {/* HÖGER: User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border">
                  <Avatar className="h-10 w-10">
                    {/* Om du har bild-URL sparad i user-metadata eller liknande: */}
                    <AvatarImage src="" alt={user?.email || ""} />
                    <AvatarFallback className="bg-brand-50 hover:bg-brand-100 text-brand-600  font-bold text-lg">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">My Profile</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/app")}>
                  <Search className="mr-2 h-4 w-4" />
                  <span>Find Matches</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/chat")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>My Chats</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* SIDINNEHÅLL */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        <Outlet /> 
      </main>
    </div>
  )
}
