import { useCallback, useEffect, useRef, useState } from 'react'
import { Howl, Howler } from 'howler'
import { SoundContext } from './sound-context'

const BASE = import.meta.env.BASE_URL

export function SoundProvider({ children }) {
  const [isMusicMuted, setIsMusicMuted] = useState(false)
  const [isSfxMuted,   setIsSfxMuted]   = useState(false)
  const [volume,       setVolume]        = useState(1)

  const ambientRef = useRef(null)
  // Mutable snapshot so listeners registered once (visibility, first-click)
  // always act on current state instead of a stale closure.
  const stateRef = useRef({ musicMuted: false, wantsAmbient: false, isHome: true, isVisible: true })

  useEffect(() => { Howler.volume(volume) }, [volume])

  useEffect(() => {
    const howl = new Howl({
      src: [`${BASE}sounds/underwater background.mp3`],
      loop: true,
      volume: 0.3,
    })
    ambientRef.current = howl
    return () => howl.unload()
  }, [])

  const syncAmbient = useCallback(() => {
    const howl = ambientRef.current
    if (!howl) return
    const s = stateRef.current
    const shouldPlay = s.wantsAmbient && s.isHome && s.isVisible && !s.musicMuted
    if (shouldPlay && !howl.playing()) howl.play()
    if (!shouldPlay && howl.playing()) howl.pause()
  }, [])

  // Start ambient on first user interaction anywhere in the app
  useEffect(() => {
    function onFirstInteraction() {
      stateRef.current.wantsAmbient = true
      syncAmbient()
      document.removeEventListener('click', onFirstInteraction)
    }
    document.addEventListener('click', onFirstInteraction)
    return () => document.removeEventListener('click', onFirstInteraction)
  }, [syncAmbient])

  // Stop ambient when the browser tab is hidden, resume when visible again
  useEffect(() => {
    function onVisibility() {
      stateRef.current.isVisible = document.visibilityState === 'visible'
      syncAmbient()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [syncAmbient])

  useEffect(() => {
    stateRef.current.musicMuted = isMusicMuted
    syncAmbient()
  }, [isMusicMuted, syncAmbient])

  // Called by the route watcher — ambient only plays on the home scene
  const setHomeActive = useCallback((active) => {
    stateRef.current.isHome = active
    syncAmbient()
  }, [syncAmbient])

  return (
    <SoundContext.Provider value={{
      isMusicMuted, toggleMusic: () => setIsMusicMuted(m => !m),
      isSfxMuted,   toggleSfx:   () => setIsSfxMuted(s => !s),
      volume, setVolume,
      setHomeActive,
    }}>
      {children}
    </SoundContext.Provider>
  )
}
