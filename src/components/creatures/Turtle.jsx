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
  const navigate  = useNavigate()
  const clickedRef = useRef(false)
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

  function handleHoverEnter() {
    setHovered(true)
    if (soundEnabled) playHover()
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
      onMouseEnter={handleHoverEnter}
      onMouseLeave={() => setHovered(false)}
      role="button"
      aria-label="Go to Certificates"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div ref={animRef} style={{ position: 'relative' }}>
        <span className={`creature-tooltip turtle-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
          Certificates
        </span>
        <img
          src={`${BASE}creatures/turtle_both.png`}
          alt="Turtle with baby"
          width={180}
          draggable={false}
          className={`turtle-img${hovered ? ' turtle-img--hovered' : ''}`}
        />
      </div>
    </div>
  )
}
