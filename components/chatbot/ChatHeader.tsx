// components/chatbot/ChatHeader.tsx
import { Mic, Trash2, Volume2, VolumeX, X } from 'lucide-react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'

interface ChatHeaderProps {
  onClose: () => void
  onToggleVoice?: () => void
  onClearChat?: () => void
  isVoiceMuted?: boolean
  isListening?: boolean
}

export default function ChatHeader({
  onClose,
  onToggleVoice,
  onClearChat,
  isVoiceMuted = false,
  isListening = false,
}: ChatHeaderProps) {
  return (
    <div className="bg-brand text-white p-4 border border-gold-600 lg:rounded-t-2xl flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gold-600 bg-opacity-20 rounded-full flex items-center justify-center">
          <Avatar>
            <AvatarImage src="/bot.png" alt="Axon" width={100} height={100} />
          </Avatar>
        </div>
        <div>
          <h3 className="font-semibold">Axon</h3>
          <p className="text-gold-50 text-xs">Online • Ready to help</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onToggleVoice && (
          <button
            onClick={onToggleVoice}
            className="p-1 hover:bg-emerald-700 hover:bg-opacity-20 rounded transition-colors"
            title={isVoiceMuted ? 'Unmute voice' : 'Mute voice'}
          >
            {isVoiceMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        )}

        {onToggleVoice && (
          <button
            onClick={onToggleVoice}
            className={`p-1 rounded transition-colors ${
              isListening
                ? 'bg-emerald-700 bg-opacity-20'
                : 'hover:bg-emerald-700 hover:bg-opacity-20'
            }`}
            title="Voice input"
          >
            <Mic size={16} className={isListening ? 'text-red-300' : ''} />
          </button>
        )}

        {onClearChat && (
          <button
            onClick={onClearChat}
            className="p-1 hover:bg-emerald-700 hover:bg-opacity-20 rounded transition-colors"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
        )}

        <button
          onClick={onClose}
          className="p-1 hover:bg-red-600 hover:bg-opacity-10 rounded transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
