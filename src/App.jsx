import { useState } from 'react'
import ProfileSetup from './components/ProfileSetup'
import MatchFeed from './components/MatchFeed'
import TeachLearnBoard from './components/TeachLearnBoard'
import ConnectModal from './components/ConnectModal'
import BlockStack from './components/BlockStack'

const TABS = [
  { key: 'matches', label: 'Matches' },
  { key: 'teach-learn', label: 'Teach & Learn' },
]

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [tab, setTab] = useState('matches')
  const [connectingWith, setConnectingWith] = useState(null)
  const [nicknames, setNicknames] = useState({})

  if (!currentUser) {
    return <ProfileSetup onComplete={setCurrentUser} />
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface2 sticky top-0 bg-ink/90 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-semibold text-offwhite">Blocks</span>
            <BlockStack tags={currentUser.tags} size="sm" />
          </div>
          <nav className="flex gap-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  tab === t.key ? 'bg-marigold text-ink' : 'text-muted hover:text-offwhite'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {tab === 'matches' && (
          <MatchFeed currentUser={currentUser} onConnect={setConnectingWith} />
        )}
        {tab === 'teach-learn' && (
          <TeachLearnBoard currentUser={currentUser} onConnect={setConnectingWith} />
        )}
      </main>

      {connectingWith && (
        <ConnectModal
          user={{ ...connectingWith, username: nicknames[connectingWith.id] || connectingWith.username }}
          onClose={() => setConnectingWith(null)}
          onSaveNickname={(id, nick) => setNicknames({ ...nicknames, [id]: nick })}
        />
      )}
    </div>
  )
}
