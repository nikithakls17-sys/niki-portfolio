import { useContext } from 'react'
import { SoundContext } from './sound-context'

export function useSoundCtx() {
  return useContext(SoundContext)
}
