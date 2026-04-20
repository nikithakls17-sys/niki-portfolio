import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function Turtle({ style }) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const posRef     = useRef(null)
  const animRef    = useRef(null)
  const clickedRef = useRef(false)
  const navigate   = useNavigate()
  const { isSfxMuted } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/chime.wav`, { volume: 0.5, interrupt: true })

  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(el, { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleMouseEnter() {
    setIsRevealed(true)
    setHovered(true)
    gsap.to(posRef.current, { scale: 1.15, duration: 0.3, ease: 'power2.out' })
    if (!isSfxMuted) playHover()
  }

  function handleMouseLeave() {
    setHovered(false)
    setTimeout(() => setIsRevealed(false), 300)
    if (clickedRef.current) return
    gsap.to(posRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' })
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    gsap.to(posRef.current, {
      scale: 1.2,
      duration: 0.15,
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
      <div ref={animRef}>
        <span className={`creature-tooltip turtle-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
          Certificates
        </span>
        <div
          style={{
            position: 'relative',
            width: 200,
            minHeight: 130,
            filter: hovered ? 'drop-shadow(0 0 10px rgba(80,220,120,0.7))' : 'none',
            transition: 'filter 0.3s ease',
          }}
        >
          <img
            src={`${BASE}creatures/turtle_shell.png`}
            alt="Turtle shell"
            draggable={false}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%',
              opacity: isRevealed ? 0 : 1,
              transition: 'opacity 0.8s ease',
            }}
          />
          <img
            src={`${BASE}creatures/turtle_both.png`}
            alt="Turtle with baby"
            draggable={false}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%',
              opacity: isRevealed ? 1 : 0,
              transition: 'opacity 0.8s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
