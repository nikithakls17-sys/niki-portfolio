import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function Turtle({ style }) {
  const [hovered, setHovered] = useState(false)
  const posRef    = useRef(null)
  const animRef   = useRef(null)
  const shellRef  = useRef(null)
  const bothRef   = useRef(null)
  const navigate  = useNavigate()
  const clickedRef = useRef(false)
  const { soundEnabled } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/chime.wav`, { volume: 0.5, interrupt: true })

  // Slowest bob of all creatures — 4s cycle
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -6 }, { y: 6, duration: 4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleHoverEnter() {
    setHovered(true)
    if (soundEnabled) playHover()
    gsap.killTweensOf([shellRef.current, bothRef.current])
    gsap.fromTo(bothRef.current, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'sine.out' })
    gsap.to(shellRef.current, { opacity: 0, duration: 0.5, ease: 'sine.out' })
  }

  function handleHoverLeave() {
    setHovered(false)
    if (clickedRef.current) return
    gsap.killTweensOf([shellRef.current, bothRef.current])
    gsap.to(bothRef.current, { opacity: 0, duration: 0.5, ease: 'sine.in' })
    gsap.to(shellRef.current, { opacity: 1, duration: 0.8, ease: 'sine.in' })
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    gsap.to(posRef.current, {
      scale: 1.15,
      duration: 0.2,
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
      onMouseEnter={handleHoverEnter}
      onMouseLeave={handleHoverLeave}
      role="button"
      aria-label="Go to Certificates"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div ref={animRef} style={{ position: 'relative', width: 180 }}>
        <span className={`creature-tooltip turtle-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
          Certificates
        </span>
        <img
          ref={shellRef}
          src={`${BASE}creatures/turtle_shell.png`}
          alt="Turtle hiding in shell"
          width={180}
          draggable={false}
          style={{ display: 'block' }}
        />
        <img
          ref={bothRef}
          src={`${BASE}creatures/turtle_both.png`}
          alt="Turtle with baby"
          width={180}
          draggable={false}
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}
        />
      </div>
    </div>
  )
}
