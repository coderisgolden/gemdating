import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { ProfileView } from '@/components/ProfileView'
import { MatchModal } from '@/components/MatchModal'


export function LikesPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // States
  const [likes, setLikes] = useState<any[]>([])
  const [selectedProfile, setSelectedProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchData, setMatchData] = useState<any>(null)
  const [myPhoto, setMyPhoto] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);

  // 1. Fetch people who liked ME (to_user_id = my id)
  useEffect(() => {
    async function loadLikes() {
      if (!user?.id) return
      
      const { data, error } = await supabase
        .from('likes')
        .select(`
          from_user_id,
          profile:profiles!likes_from_user_id_fkey(*)
        `)
        .eq('to_user_id', user.id)
        .or('is_matched.eq.false,is_matched.is.null') // Only show un-matched likes

      if (error) {
        console.error("Error fetching likes:", error)
      } else if (data) {
        const profiles = data.map(item => item.profile).filter(Boolean)
        setLikes(profiles)
        if (profiles.length > 0) setSelectedProfile(profiles[0])
      }
      setLoading(false)
    }

    loadLikes()
  }, [user?.id])


  // Fetch my profile photo
  useEffect(() => {
  async function getMyProfile() {
    if (!user?.id) return;
    const { data, error } = await supabase
      .from('profiles')
      .select('photo_urls')
      .eq('id', user.id)
      .single();
    
    if (data && data.photo_urls && data.photo_urls.length > 0) {
      setMyPhoto(data.photo_urls[0]); 
      //setMyPhoto(data.photo_urls[0] || 'https://via.placeholder.com');
    }
    
    if (error) {
      console.error("Error fetching my photo:", error.message);
    }
  }
  getMyProfile();
}, [user?.id]);




  // 2. The "Like Back" logic
  // const handleLikeBack = async (targetId: string) => {
  //   const { data, error } = await supabase.rpc('handle_like', { 
  //     target_user_id: targetId 
  //   })

  //   if (error) return
  //   setMatchData(data)

  //   if (data?.isMatch) {
  //     // It's a match! Show the popup
  //     setShowMatchModal(true)
  //     // Note: We DON'T set selectedProfile to null here yet 
  //     // to keep the background visible behind the modal
  //   } else {
  //     // Just a normal like (shouldn't happen here, but safe to have)
  //     setLikes(prev => prev.filter(p => p.id !== targetId))
  //     setSelectedProfile(likes.find(p => p.id !== targetId) || null)
  //   }
  // }

const handleLikeBack = async (targetId: string) => {
  setIsLiking(true); // 1. Starta laddningen/spinnern här!

  const { data, error } = await supabase.rpc('handle_like', { 
    target_user_id: targetId 
  });

  if (error) {
    console.error("Error matching:", error);
    setIsLiking(false); // Stoppa om det blir fel
    return;
  }

  setMatchData(data);

  if (data?.isMatch) {
    // Det blev en match! Visa popupen
    setShowMatchModal(true);
    // Vi sätter INTE isLiking till false här än, 
    // låt den snurra tills modalen faktiskt visas.
  } else {
    // Om det bara var en vanlig like
    setLikes(prev => prev.filter(p => p.id !== targetId));
    setSelectedProfile(likes.find(p => p.id !== targetId) || null);
    setIsLiking(false); // Stoppa laddningen här
  }
};



  // if (loading) return <div className="h-full flex items-center justify-center"></div>

  if (likes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-slate-400">
        <div className="bg-slate-100 p-6 rounded-full mb-6">
          <Heart className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No likes yet</h2>
        <p className="mb-6">Keep exploring to find your perfect match!</p>
        <Button onClick={() => navigate('/app')} className="rounded-full bg-brand-500 hover:bg-brand-600 px-8">
          Go Discover
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white border rounded-3xl overflow-hidden shadow-xl animate-in fade-in zoom-in-95 duration-500">
      
      {/* LEFT SIDEBAR: List of people */}
      <div className="w-80 border-r flex flex-col bg-slate-50/50">
        <div className="p-6 border-b bg-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-black text-slate-900">Likes</h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-1">
            {likes.map((profile) => (
              <button 
                key={profile.id}
                onClick={() => setSelectedProfile(profile)}
                className={`w-full p-4 flex items-center gap-3 rounded-2xl transition-all ${
                  selectedProfile?.id === profile.id 
                    ? 'bg-white shadow-md ring-1 ring-black/5 scale-[1.02]' 
                    : 'hover:bg-white/60'
                }`}
              >
                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                  <AvatarImage src={profile.photo_urls?.[0]} className="object-cover" />
                  <AvatarFallback className="bg-brand-50 text-brand-600 font-bold">
                    {profile.about_you?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold text-slate-900 truncate">{profile.about_you?.name}</p>
                  <p className="text-xs text-slate-500 truncate">Likes your profile</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* RIGHT CONTENT: Profile View */}
      <div className="flex-1 relative">
        {selectedProfile ? (
          <ProfileView 
            profile={selectedProfile} 
            onLike={() => handleLikeBack(selectedProfile.id)} 
            isLiking={isLiking} // Pass the loading state to ProfileView
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-400">
            Select a profile to view details
          </div>
        )}

        {/* STABLE MATCH MODAL */}
        <MatchModal 
          isOpen={showMatchModal}
          onClose={() => {
            setShowMatchModal(false)
            // AFTER closing the modal, we remove them from the list
            setLikes(prev => prev.filter(p => p.id !== selectedProfile?.id))
            setSelectedProfile(null)
          }}
          currentUserPhoto={myPhoto} // You can pass your own avatar here later
          matchedUserPhoto={selectedProfile?.photo_urls?.[0]}
          matchedUserName={selectedProfile?.about_you?.name || "Match"}
          onSendMessage={() => {
            if (matchData?.matchId) {
              navigate(`/chat?matchId=${matchData.matchId}`)
            }
          }}
        />
      </div>
    </div>
  )
}
