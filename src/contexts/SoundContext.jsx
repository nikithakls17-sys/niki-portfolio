import { createContext, useContext, useState, useEffect } from 'react'
import { Howler } from 'howler'

const SoundContext = createContext({
  soundEnabled: true,
  setSoundEnabled: () => {},
  volume: 1,
  setVolume: () => {},
})

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(1)

  // Global mute/unmute via Howler
  useEffect(() => {
    Howler.mute(!soundEnabled)
  }, [soundEnabled])

  // Global volume via Howler
  useEffect(() => {
    Howler.volume(volume)
  }, [volume])

  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSoundCtx = () => useContext(SoundContext)
