import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

export default function PufferFish({ style }) {
  const [hovered, setHovered] = useState(false)
  const posRef   = useRef(null) // positioning wrapper (click + hover target)
  const swimRef  = useRef(null) // GSAP left-right swim
  const animRef  = useRef(null) // GSAP scale puff
  const puffer2  = useRef(null) // deflated img
  const puffer1  = useRef(null) // puffed img
  const puffState  = useRef('deflated') // 'deflated'|'puffing'|'puffed'|'deflating'
  const clickedRef = useRef(false)
  const navigate = useNavigate()
  const { soundEnabled } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/bubble deep.wav`, { volume: 0.6, interrupt: true })

  // Gentle left-right swim on swimRef (avoids conflicting with posRef transform)
  useEffect(() => {
    const el = swimRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { x: -14 }, { x: 14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function startPuff() {
    if (puffState.current === 'puffing' || puffState.current === 'puffed') return
    puffState.current = 'puffing'
    gsap.killTweensOf([animRef.current, puffer1.current, puffer2.current])
    gsap.to(animRef.current, {
      scale: 2,
      duration: 3,
      ease: 'sine.inOut',
      transformOrigin: 'center center',
      onComplete: () => { puffState.current = 'puffed' },
    })
    gsap.to(puffer2.current, { opacity: 0, duration: 3, ease: 'sine.inOut' })
    gsap.to(puffer1.current, { opacity: 1, duration: 3, ease: 'sine.inOut' })
  }

  function endPuff() {
    if (puffState.current === 'deflated' || puffState.current === 'deflating') return
    puffState.current = 'deflating'
    gsap.killTweensOf([animRef.current, puffer1.current, puffer2.current])
    gsap.to(animRef.current, {
      scale: 1,
      duration: 2,
      ease: 'sine.inOut',
      onComplete: () => { puffState.current = 'deflated' },
    })
    gsap.to(puffer2.current, { opacity: 1, duration: 2, ease: 'sine.inOut' })
    gsap.to(puffer1.current, { opacity: 0, duration: 2, ease: 'sine.inOut' })
  }

  function handleMouseEnter() {
    setHovered(true)
    startPuff()
    if (soundEnabled) playHover()
  }

  function handleMouseLeave() {
    setHovered(false)
    if (!clickedRef.current) endPuff()
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    startPuff()
    // puff (3s) + hold (1s) then navigate
    setTimeout(() => navigate('/hobbies'), 4000)
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
      {/* tooltip outside both anim layers so it doesn't scale */}
      <span className={`creature-tooltip puffer-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
        Hobbies
      </span>

      {/* swim layer */}
      <div ref={swimRef}>
        {/* scale/puff layer */}
        <div ref={animRef} style={{ position: 'relative', width: 100 }}>
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
