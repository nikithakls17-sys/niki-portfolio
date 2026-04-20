import { createContext, useContext, useState, useEffect } from 'react'
import { Howler } from 'howler'

const SoundContext = createContext({
  isMusicMuted: false,
  isSfxMuted:   false,
  volume:       1,
  toggleMusic:  () => {},
  toggleSfx:    () => {},
  setVolume:    () => {},
})

export function SoundProvider({ children }) {
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const [isSfxMuted,   setIsSfxMuted]   = useState(false)
  const [volume,       setVolume]        = useState(1)

  useEffect(() => { Howler.volume(volume) }, [volume])

  return (
    <SoundContext.Provider value={{
      isMusicMuted, toggleMusic: () => setIsMusicMuted(m => !m),
      isSfxMuted,   toggleSfx:   () => setIsSfxMuted(s => !s),
      volume, setVolume,
    }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSoundCtx = () => useContext(SoundContext)
