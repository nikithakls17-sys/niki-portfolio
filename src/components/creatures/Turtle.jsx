import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function Turtle({ style }) {
  const [hovered, setHovered] = useState(false)
  const posRef     = useRef(null)
  const animRef    = useRef(null)
  const clickedRef = useRef(false)
  const navigate   = useNavigate()
  const { isSfxMuted } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/chime.wav`, { volume: 0.5, interrupt: true })

  // Idle bob — same rhythm as other creatures
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(el, { y: -12, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleMouseEnter() {
    setHovered(true)
    gsap.to(posRef.current, { scale: 1.15, duration: 0.3, ease: 'power2.out' })
    if (!isSfxMuted) playHover()
  }

  function handleMouseLeave() {
    setHovered(false)
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
        <img
          src={`${BASE}creatures/turtle_both.png`}
          alt="Turtle with baby"
          width={200}
          draggable={false}
          className={`turtle-img${hovered ? ' turtle-img--hovered' : ''}`}
          style={{ display: 'block' }}
        />
      </div>
    </div>
  )
}
