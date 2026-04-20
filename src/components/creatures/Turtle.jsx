import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function Turtle({ style }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const animRef    = useRef(null)
  const posRef     = useRef(null)
  const hideTimer  = useRef(null)
  const clickedRef = useRef(false)
  const navigate   = useNavigate()
  const { soundEnabled } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/chime.wav`, { volume: 0.5, interrupt: true })

  // Slowest bob — 4s cycle
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -6 }, { y: 6, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleMouseEnter() {
    clearTimeout(hideTimer.current)
    setIsRevealed(true)
    if (soundEnabled) playHover()
  }

  function handleMouseLeave() {
    if (clickedRef.current) return
    hideTimer.current = setTimeout(() => setIsRevealed(false), 500)
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    gsap.to(posRef.current, {
      scale: 1.1,
      duration: 0.18,
      yoyo: true,
      repeat: 1,
      ease: 'power2.out',
      onComplete: () => navigate('/certificates'),
    })
  }

  return (
    <div
      ref={posRef}
      className="turtle-pos"
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label="Go to Certificates"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div ref={animRef} style={{ position: 'relative', width: 200, height: 200 }}>
        <span className={`creature-tooltip turtle-tooltip${isRevealed ? ' creature-tooltip--visible' : ''}`}>
          Certificates
        </span>

        {/* shell only */}
        <img
          src={`${BASE}creatures/turtle_shell.png`}
          alt="Turtle hiding in shell"
          draggable={false}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%',
            opacity: isRevealed ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />
        {/* mama + baby */}
        <img
          src={`${BASE}creatures/turtle_both.png`}
          alt="Turtle with baby"
          draggable={false}
          className={isRevealed ? 'turtle-img--hovered' : 'turtle-img'}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%',
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />
      </div>
    </div>
  )
}
