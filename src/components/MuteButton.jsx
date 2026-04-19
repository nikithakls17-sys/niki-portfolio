import { useSoundCtx } from '../contexts/SoundContext'

export default function MuteButton() {
  const { soundEnabled, setSoundEnabled } = useSoundCtx()
  return (
    <button
      className="mute-btn"
      onClick={() => setSoundEnabled(v => !v)}
      aria-label={soundEnabled ? 'Mute sounds' : 'Unmute sounds'}
    >
      {soundEnabled ? '🔊' : '🔇'}
    </button>
  )
}
