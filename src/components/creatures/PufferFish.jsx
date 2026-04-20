import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function PufferFish({ style }) {
  const [hovered, setHovered] = useState(false)
  const posRef    = useRef(null)
  const swimRef   = useRef(null)
  const puffer2   = useRef(null)
  const puffer1   = useRef(null)
  const idleTweens = useRef([])
  const navigate  = useNavigate()
  const clickedRef = useRef(false)
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

  // Idle breathing: slow crossfade puffer2 ↔ puffer1, 3s each direction
  function startIdle() {
    gsap.killTweensOf([puffer1.current, puffer2.current])
    const t1 = gsap.to(puffer2.current, { opacity: 0, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    const t2 = gsap.to(puffer1.current, { opacity: 1, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    idleTweens.current = [t1, t2]
  }

  function stopIdle() {
    idleTweens.current.forEach(t => t.kill())
    idleTweens.current = []
  }

  useEffect(() => {
    startIdle()
    return () => stopIdle()
  }, [])

  function handleMouseEnter() {
    setHovered(true)
    stopIdle()
    // Instantly jump to puffed state
    gsap.set(puffer2.current, { opacity: 0 })
    gsap.set(puffer1.current, { opacity: 1 })
    if (soundEnabled) playHover()
  }

  function handleMouseLeave() {
    setHovered(false)
    if (clickedRef.current) return
    startIdle()
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    setTimeout(() => navigate('/hobbies'), 300)
  }

  return (
    <div
      ref={posRef}
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
      <span className={`creature-tooltip puffer-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
        Hobbies
      </span>

      <div ref={swimRef}>
        <div className={`puffer-img-wrap${hovered ? ' puffer-img-wrap--hovered' : ''}`} style={{ position: 'relative', width: 100 }}>
          <img
            ref={puffer2}
            src={`${BASE}creatures/puffer2.png`}
            alt="Puffer fish"
            width={100}
            draggable={false}
            style={{ display: 'block' }}
          />
          <img
            ref={puffer1}
            src={`${BASE}creatures/puffer1.png`}
            alt="Puffer fish puffed"
            width={100}
            draggable={false}
            style={{ position: 'absolute', top: 0, left: 0, opacity: 0 }}
          />
        </div>
      </div>
    </div>
  )
}
