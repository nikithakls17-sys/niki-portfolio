import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

const SMALL = 120
const BIG   = 220

export default function PufferFish({ style }) {
  const [isPuffed, setIsPuffed] = useState(false)
  const containerRef = useRef(null)
  const swimRef    = useRef(null)
  const clickedRef = useRef(false)
  const navigate   = useNavigate()
  const { isSfxMuted } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/bubble deep.wav`, { volume: 0.6, interrupt: true })

  useEffect(() => {
    const tween = gsap.to(containerRef.current, {
      y: -10,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
    return () => tween.kill()
  }, [])

  // Gentle left-right swim on the swim wrapper
  useEffect(() => {
    const el = swimRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { x: -10 }, { x: 10, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleMouseEnter() {
    setIsPuffed(true)
    if (!isSfxMuted) playHover()
  }

  function handleMouseLeave() {
    if (clickedRef.current) return
    setIsPuffed(false)
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    setIsPuffed(true)
    setTimeout(() => navigate('/hobbies'), 400)
  }

  const size = isPuffed ? BIG : SMALL

  return (
    <div
      ref={containerRef}
      className="puffer-pos"
      style={style}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="button"
      aria-label="Go to Hobbies"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <span className={`creature-tooltip puffer-tooltip${isPuffed ? ' creature-tooltip--visible' : ''}`}>
        Hobbies
      </span>

      <div ref={swimRef}>
        {/* Container resizes with the active image */}
        <div
          className={`puffer-img-wrap${isPuffed ? ' puffer-img-wrap--hovered' : ''}`}
          style={{
            position: 'relative',
            width: size,
            height: size,
            transition: 'width 0.5s ease, height 0.5s ease',
          }}
        >
          {/* deflated — 120px natural */}
          <img
            src={`${BASE}creatures/puffer2.png`}
            alt="Puffer fish"
            draggable={false}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'contain',
              opacity: isPuffed ? 0 : 1,
              transition: 'opacity 0.4s ease',
            }}
          />
          {/* puffed — 220px natural */}
          <img
            src={`${BASE}creatures/puffer1.png`}
            alt="Puffer fish puffed"
            draggable={false}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              objectFit: 'contain',
              opacity: isPuffed ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
