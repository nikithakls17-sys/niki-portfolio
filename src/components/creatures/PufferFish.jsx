import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function PufferFish({ style }) {
  const [isPuffed, setIsPuffed] = useState(false)
  const containerRef = useRef(null)
  const swimRef      = useRef(null)
  const idleRef      = useRef(null)
  const clickedRef   = useRef(false)
  const navigate     = useNavigate()
  const { soundEnabled } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/bubble deep.wav`, { volume: 0.6, interrupt: true })

  // Gentle left-right swim
  useEffect(() => {
    const el = swimRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { x: -10 }, { x: 10, duration: 2.8, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  // Idle breathing: toggle isPuffed every 3s
  function startIdle() {
    stopIdle()
    idleRef.current = setInterval(() => {
      setIsPuffed(p => !p)
    }, 3000)
  }

  function stopIdle() {
    if (idleRef.current) {
      clearInterval(idleRef.current)
      idleRef.current = null
    }
  }

  useEffect(() => {
    startIdle()
    return stopIdle
  }, [])

  function handleMouseEnter() {
    stopIdle()
    setIsPuffed(true)
    if (soundEnabled) playHover()
  }

  function handleMouseLeave() {
    if (clickedRef.current) return
    setTimeout(() => {
      setIsPuffed(false)
      startIdle()
    }, 1000)
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    stopIdle()
    setIsPuffed(true)
    setTimeout(() => navigate('/hobbies'), 400)
  }

  return (
    <div
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
        <div
          ref={containerRef}
          className={`puffer-img-wrap${isPuffed ? ' puffer-img-wrap--hovered' : ''}`}
          style={{ position: 'relative', width: 180, height: 180 }}
        >
          {/* deflated */}
          <img
            src={`${BASE}creatures/puffer2.png`}
            alt="Puffer fish"
            draggable={false}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%',
              opacity: isPuffed ? 0 : 1,
              transition: 'opacity 0.5s ease',
            }}
          />
          {/* puffed */}
          <img
            src={`${BASE}creatures/puffer1.png`}
            alt="Puffer fish puffed"
            draggable={false}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%',
              opacity: isPuffed ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        </div>
      </div>
    </div>
  )
}
