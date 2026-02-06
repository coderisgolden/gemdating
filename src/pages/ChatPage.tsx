import React, { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Send, MessageSquare } from 'lucide-react'


export function ChatPage() {
  const { user } = useAuth()
  const [matches, setMatches] = useState<any[]>([])
  const [selectedMatch, setSelectedMatch] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}
  // 1. Hämta alla matcher
  useEffect(() => {
    async function loadMatches() {
      if (!user) return
      const { data, } = await supabase
  .from('matches')
  .select(`
    id,
    user_1,
    user_2,
    user_1_profile:profiles!matches_user_1_fkey(id, about_you, photo_urls),
    user_2_profile:profiles!matches_user_2_fkey(id, about_you, photo_urls)
  `)
  .or(`user_1.eq.${user.id},user_2.eq.${user.id}`)

if (data) {
  const formattedMatches = data.map(m => {
    // Här använder vi namnen vi skapade ovan: user_1_profile och user_2_profile
    const otherUser = m.user_1 === user.id ? m.user_2_profile : m.user_1_profile
    
    // Fallback om profilen saknas (viktigt för att undvika krasch)
    if (!otherUser) return null;

    return { 
      matchId: m.id, 
      ...otherUser 
    }
  }).filter(Boolean) // Tar bort eventuella null-värden
  
  setMatches(formattedMatches)
}

    }
    loadMatches()
  }, [user])


  useEffect(() => {
  scrollToBottom()
}, [messages, selectedMatch])






  // 2. Hämta meddelanden när en match väljs + Realtime
  useEffect(() => {
    if (!selectedMatch || !user?.id) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', selectedMatch.matchId)
        .order('created_at', { ascending: true })
      setMessages(data || [])
    }

    fetchMessages()

    // REALTIME: Lyssna på nya meddelanden
    const channel = supabase
      .channel(`match_${selectedMatch.matchId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${selectedMatch.matchId}` }, 
      (payload) => {
        setMessages((prev) => [...prev, payload.new])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [selectedMatch])




  useEffect(() => {
  // Om ingen match är vald eller vi inte vet vem användaren är, avbryt
  if (!selectedMatch || !user) return;

  const markAsRead = async () => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: true }) // Sätt till läst
      .eq('match_id', selectedMatch.matchId) // För just denna chatt
      .eq('is_read', false) // Bara de som inte redan är lästa
      .neq('sender_id', user.id); // Och som skickats av den ANDRA personen

    if (error) console.error("Kunde inte markera som läst:", error);
  };

  markAsRead();
}, [selectedMatch, user?.id]); // Körs varje gång du byter person i chatten




  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedMatch) return

    const { error } = await supabase.from('messages').insert([
      {
        match_id: selectedMatch.matchId,
        sender_id: user?.id,
        content: newMessage.trim()
      }
    ])

    if (!error) setNewMessage('')
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white border rounded-xl overflow-hidden shadow-sm">
      {/* VÄNSTER: Match-lista */}
      <div className="w-80 border-r flex flex-col bg-gray-50/50">
        <div className="p-4 border-b bg-white">
          <h2 className="text-xl font-bold">Meddelanden</h2>
        </div>
        <ScrollArea className="flex-1">
          
          {matches.map((m) => (
            <div 
              key={m.matchId}
              onClick={() => setSelectedMatch(m)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-white ${selectedMatch?.matchId === m.matchId ? 'bg-white border-r-4 border-brand-500' : ''}`}
            >
              <Avatar className="h-12 w-12 border">
                <AvatarImage src={m.photo_urls?.[0]} className="object-cover" />
                <AvatarFallback>{m.about_you?.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{m.about_you?.name}</p>
                <p className="text-xs text-gray-500 truncate">Klicka för att chatta</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* HÖGER: Chat-fönster */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedMatch ? (
          <>
            <div className="p-4 border-b flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedMatch.photo_urls?.[0]} className="object-cover" />
              </Avatar>
              <p className="font-bold">{selectedMatch.about_you?.name}</p>
            </div>

            <ScrollArea className="flex-1 p-4 space-y-4">
              <div className="space-y-4"> 
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${msg.sender_id === user?.id ? 'bg-brand-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <form onSubmit={sendMessage} className="p-4 border-t flex gap-2">
              <Input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Skriv ett meddelande..."
                className="rounded-full"
              />
              <Button type="submit" size="icon" className="rounded-full bg-brand-500 hover:bg-brand-600">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>Välj en matchning för att börja chatta</p>
          </div>
        )}
      </div>
    </div>
  )
}
