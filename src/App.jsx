import { useEffect, useState } from 'react'
import ProfileSetup from './components/ProfileSetup'
import ProfileView from './components/ProfileView'
import MatchFeed from './components/MatchFeed'
import TeachLearnBoard from './components/TeachLearnBoard'
import Contacts from './components/Contacts'
import ConnectModal from './components/ConnectModal'
import BlockStack from './components/BlockStack'
import LogoMark from './components/LogoMark'
import { fetchMyProfile, createProfile, updateProfile, sendConnectionRequest } from './lib/db'

const TABS = [
  { key: 'matches', label: 'Matches' },
  { key: 'teach-learn', label: 'Teach & Learn' },
  { key: 'contacts', label: 'Contacts' },
  { key: 'profile', label: 'Profile' },
]

function useTheme() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tapestry-theme') || 'dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('tapestry-theme', theme)
  }, [theme])

  return [theme, setTheme]
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('matches')
  const [connecting, setConnecting] = useState(null) // { candidate, connection }
  const [theme, setTheme] = useTheme()

  useEffect(() => {
    fetchMyProfile()
      .then(setCurrentUser)
      .finally(() => setLoading(false))
  }, [])

  async function handleProfileComplete(data) {
    const profile = currentUser ? await updateProfile(currentUser.id, data) : await createProfile(data)
    setCurrentUser(profile)
  }

  async function handleConnect(candidate) {
    const connection = await sendConnectionRequest(currentUser.id, candidate.id)
    setConnecting({ candidate, connection })
  }

  if (loading) {
    return <p className="text-muted text-center py-14">Loading...</p>
  }

  if (!currentUser) {
    return <ProfileSetup onComplete={handleProfileComplete} />
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-surface2 sticky top-0 bg-canvas/90 backdrop-blur z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoMark size={26} />
            <span className="font-display text-lg font-semibold text-offwhite">Tapestry</span>
            <BlockStack tags={currentUser.tags} size="sm" />
          </div>
          <div className="flex items-center gap-3">
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
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 shrink-0 rounded-full border border-surface2 text-muted hover:text-offwhite hover:border-muted transition-colors flex items-center justify-center"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {tab === 'matches' && (
          <MatchFeed
            currentUser={currentUser}
            onConnect={handleConnect}
            onEditProfile={() => setTab('profile')}
          />
        )}
        {tab === 'teach-learn' && (
          <TeachLearnBoard currentUser={currentUser} onConnect={handleConnect} />
        )}
        {tab === 'contacts' && (
          <Contacts currentUser={currentUser} onOpen={setConnecting} />
        )}
        {tab === 'profile' && (
          <ProfileView currentUser={currentUser} onUpdate={handleProfileComplete} />
        )}
      </main>

      {connecting && (
        <ConnectModal
          myProfile={currentUser}
          candidate={connecting.candidate}
          initialConnection={connecting.connection}
          onClose={() => setConnecting(null)}
        />
      )}
    </div>
  )
}
