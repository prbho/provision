import { useState } from 'react'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim()) return
    onSend(text)
    setText('')
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-t bg-white">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Type your message..."
        className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand"
      />

      <button
        onClick={handleSend}
        className="p-2 rounded-lg bg-brand text-white hover:bg-brand"
      >
        <Send size={16} />
      </button>
    </div>
  )
}

