import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Heart, MessageCircle } from 'lucide-react'
import { motion} from 'framer-motion'

interface MatchModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserPhoto: string | null
  matchedUserPhoto: string
  matchedUserName: string
  onSendMessage: () => void
}

export function MatchModal({ 
  isOpen, 
  onClose, 
  currentUserPhoto, 
  matchedUserPhoto, 
  matchedUserName,
  onSendMessage 
}: MatchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md border-none bg-transparent shadow-none p-0 overflow-visible">
        <div className="relative flex flex-col items-center justify-center text-center">
          
          {/* Grattis-text med animation */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="z-10 mb-8"
          >
            <h2 className="text-5xl font-black text-white italic drop-shadow-2xl mb-2">
              IT'S A MATCH!
            </h2>
            <p className="text-white text-lg font-medium">
              You and {matchedUserName} like each other.
            </p>
          </motion.div>

          {/* Bilder som överlappar */}
          <div className="flex items-center justify-center -space-x-8 mb-12">
            <motion.div 
              initial={{ x: -100, rotate: -10, opacity: 0 }}
              animate={{ x: 0, rotate: -5, opacity: 1 }}
              className="w-40 h-40 rounded-2xl border-4 border-white overflow-hidden shadow-2xl"
            >
              <img src={currentUserPhoto || undefined} alt="Du" className="w-full h-full object-cover" />
            </motion.div>

            <div className="z-20 bg-white rounded-full p-3 shadow-xl">
              <Heart className="w-8 h-8 text-brand-500 fill-current" />
            </div>

            <motion.div 
              initial={{ x: 100, rotate: 10, opacity: 0 }}
              animate={{ x: 0, rotate: 5, opacity: 1 }}
              className="w-40 h-40 rounded-2xl border-4 border-white overflow-hidden shadow-2xl"
            >
              <img src={matchedUserPhoto} alt={matchedUserName} className="w-full h-full object-cover" />
            </motion.div>
          </div>

          {/* Knappar */}
          <div className="flex flex-col w-full gap-3 px-8">

 
            <Button 
  onClick={() => {
    console.log("Knapp klickad!");
    onSendMessage();
  }}
  className="bg-white text-brand-600 hover:bg-gray-100 rounded-full h-14 text-lg font-bold shadow-lg"
>
              <MessageCircle className="mr-2 h-5 w-5" />
              Send a message
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-white hover:bg-white/10 rounded-full h-12"
            >
              Continue searching
            </Button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}
