import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function Jellyfish({ style }) {
  const [frame, setFrame] = useState(1)
  const [hovered, setHovered] = useState(false)
  const posRef = useRef(null)
  const animRef = useRef(null)
  const navigate = useNavigate()
  const clickedRef = useRef(false)
  const { isSfxMuted } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/bubble small.wav`, { volume: 0.5, interrupt: true })
  const [playClick] = useSound(`${BASE}sounds/bubble long.wav`,  { volume: 0.7, interrupt: true })

  // 3-frame flipbook every 600ms
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f === 3 ? 1 : f + 1)), 600)
    return () => clearInterval(id)
  }, [])

  // float (3s / 15px) + sway (2s / 8px)
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -7 }, { y: 8, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.fromTo(el, { x: -8 }, { x: 8, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleHoverEnter() {
    setHovered(true)
    if (!isSfxMuted) playHover()
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    if (!isSfxMuted) playClick()
    gsap.killTweensOf(animRef.current)
    gsap.to(posRef.current, {
      y: -(window.innerHeight + 300),
      duration: 1.1,
      ease: 'power2.in',
      onComplete: () => navigate('/projects'),
    })
  }

  return (
    <div
      ref={posRef}
      className="jelly-pos"
      style={style}
      onClick={handleClick}
      onMouseEnter={handleHoverEnter}
      onMouseLeave={() => setHovered(false)}
      role="button"
      aria-label="Go to Projects"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div ref={animRef} className="jelly-anim">
        <span className={`jelly-tooltip${hovered ? ' jelly-tooltip--visible' : ''}`}>Projects</span>
        <img
          src={`${BASE}creatures/jelly${frame}.png`}
          alt="Jellyfish"
          width={260}
          draggable={false}
          className={`jelly-img${hovered ? ' jelly-img--hovered' : ''}`}
        />
      </div>
    </div>
  )
}
