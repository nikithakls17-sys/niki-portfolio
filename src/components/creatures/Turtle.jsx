import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function Turtle({ style }) {
  const [frame, setFrame] = useState(1)
  const [hovered, setHovered] = useState(false)
  const posRef      = useRef(null)
  const animRef     = useRef(null)
  const intervalRef = useRef(null)
  const clickedRef  = useRef(false)
  const navigate    = useNavigate()
  const { isSfxMuted } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/chime.wav`, { volume: 0.5, interrupt: true })

  function startInterval() {
    intervalRef.current = setInterval(() => setFrame(f => (f === 1 ? 2 : 1)), 1200)
  }

  function stopInterval() {
    clearInterval(intervalRef.current)
  }

  useEffect(() => {
    startInterval()
    return () => stopInterval()
  }, [])

  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotation: -4, transformOrigin: '50% 90%' },
        { rotation: 4, duration: 3.5, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  function handleMouseEnter() {
    stopInterval()
    setFrame(2)
    setHovered(true)
    gsap.to(posRef.current, { scale: 1.15, duration: 0.3, ease: 'power2.out' })
    if (!isSfxMuted) playHover()
  }

  function handleMouseLeave() {
    setHovered(false)
    if (clickedRef.current) return
    gsap.to(posRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' })
    startInterval()
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

  const src = frame === 1 ? 'turtle_shell' : 'turtle_both'

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
      <div ref={animRef} className="turtle-anim">
        <span className={`creature-tooltip turtle-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
          Certificates
        </span>
        <img
          src={`${BASE}creatures/${src}.png`}
          alt="Turtle"
          width={200}
          draggable={false}
          className={`turtle-img${hovered ? ' turtle-img--hovered' : ''}`}
        />
      </div>
    </div>
  )
}
