import { useState } from 'react'

export default function ConnectModal({ user, onClose, onSaveNickname }) {
  const [stage, setStage] = useState('request') // 'request' | 'sent' | 'chat'
  const [nickname, setNickname] = useState('')
  const [messages, setMessages] = useState([])
  const [draft, setDraft] = useState('')

  function sendRequest() {
    setStage('sent')
    setTimeout(() => setStage('chat'), 900) // simulated acceptance for demo
  }

  function sendMessage(e) {
    e.preventDefault()
    if (!draft.trim()) return
    setMessages([...messages, { from: 'me', text: draft.trim() }])
    setDraft('')
  }

  function saveNickname() {
    if (nickname.trim()) onSaveNickname(user.id, nickname.trim())
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div
        className="bg-surface border border-surface2 rounded-xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-xl font-semibold text-offwhite">{user.username}</h3>
          <button onClick={onClose} className="text-muted hover:text-offwhite">✕</button>
        </div>

        {stage === 'request' && (
          <div className="space-y-4">
            <p className="text-muted text-sm">
              Send a connection request. Your real identity stays anonymous until you both agree to share more.
            </p>
            <button
              onClick={sendRequest}
              className="w-full py-2.5 rounded-lg bg-marigold text-ink font-semibold hover:brightness-105"
            >
              Send request
            </button>
          </div>
        )}

        {stage === 'sent' && (
          <p className="text-muted text-sm py-6 text-center animate-pulse">Request sent...</p>
        )}

        {stage === 'chat' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-muted mb-1.5">Give them a nickname (private, only you see it)</label>
              <div className="flex gap-2">
                <input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={user.username}
                  className="flex-1 bg-ink border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite placeholder:text-muted focus:border-marigold outline-none"
                />
                <button
                  onClick={saveNickname}
                  className="px-3 py-2 rounded-lg bg-surface2 text-offwhite text-sm hover:bg-surface2/70"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="bg-ink rounded-lg p-3 h-40 overflow-y-auto space-y-2">
              {messages.length === 0 && (
                <p className="text-muted text-sm italic">Say hi — connection accepted!</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className="bg-marigold/10 text-offwhite text-sm rounded-lg px-3 py-1.5 w-fit ml-auto">
                  {m.text}
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-ink border border-surface2 rounded-lg px-3 py-2 text-sm text-offwhite placeholder:text-muted focus:border-marigold outline-none"
              />
              <button type="submit" className="px-3 py-2 rounded-lg bg-marigold text-ink text-sm font-semibold">
                Send
              </button>
            </form>

            <button className="w-full py-2 rounded-lg bg-coral/10 text-coral text-sm font-medium hover:bg-coral/20">
              Suggest a meetup →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
