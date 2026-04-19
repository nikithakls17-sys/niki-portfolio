import { createContext, useContext, useState } from 'react'

const SoundContext = createContext({ soundEnabled: true, setSoundEnabled: () => {} })

export function SoundProvider({ children }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSoundCtx = () => useContext(SoundContext)
