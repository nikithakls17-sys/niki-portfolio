import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const BASE = import.meta.env.BASE_URL

export default function Jellyfish({ style }) {
  const [frame, setFrame] = useState(1)
  const [hovered, setHovered] = useState(false)
  const posRef = useRef(null)
  const animRef = useRef(null)
  const navigate = useNavigate()
  const clickedRef = useRef(false)

  // Flipbook: swap frames every 700ms
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f === 1 ? 2 : 1)), 700)
    return () => clearInterval(id)
  }, [])

  // GSAP float (3s cycle, 15px) + sway (2s cycle, 8px)
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { y: -8 }, { y: 8, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      gsap.fromTo(el, { x: -8 }, { x: 8, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    }, el)
    return () => ctx.revert()
  }, [])

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
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
      onMouseEnter={() => setHovered(true)}
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
          width={160}
          draggable={false}
          className={`jelly-img${hovered ? ' jelly-img--hovered' : ''}`}
        />
      </div>
    </div>
  )
}
