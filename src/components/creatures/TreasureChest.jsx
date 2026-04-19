import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function TreasureChest({ style }) {
  const [open, setOpen] = useState(false)
  const posRef = useRef(null)
  const animRef = useRef(null)
  const navigate = useNavigate()
  const clickedRef = useRef(false)
  const { soundEnabled } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/treasure.wav`, { volume: 0.7, interrupt: true })
  const [playClick] = useSound(`${BASE}sounds/treasure.wav`, { volume: 1.0, interrupt: true })

  // gentle bob
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -5 }, { y: 5, duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleHoverEnter() {
    setOpen(true)
    if (soundEnabled) playHover()
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    if (soundEnabled) playClick()
    gsap.to(posRef.current, {
      scale: 1.25,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => navigate('/about'),
    })
  }

  return (
    <div
      ref={posRef}
      className="treasure-pos"
      style={style}
      onClick={handleClick}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={() => setOpen(false)}
      role="button"
      aria-label="Go to Author's Note"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div ref={animRef} className="treasure-anim">
        <span className={`creature-tooltip treasure-tooltip${open ? ' creature-tooltip--visible' : ''}`}>
          Author&rsquo;s Note
        </span>
        <img
          src={`${BASE}creatures/${open ? 'treasure_open' : 'treasure_closed'}.png`}
          alt="Treasure chest"
          width={150}
          draggable={false}
          className={`treasure-img${open ? ' treasure-img--open' : ''}`}
        />
      </div>
    </div>
  )
}
