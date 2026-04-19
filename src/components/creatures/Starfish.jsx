import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'

const BASE = import.meta.env.BASE_URL

export default function Starfish({ style }) {
  const [frame, setFrame] = useState(1)
  const [hovered, setHovered] = useState(false)
  const posRef = useRef(null)
  const animRef = useRef(null)
  const navigate = useNavigate()
  const clickedRef = useRef(false)

  // 3-frame flipbook every 800ms
  useEffect(() => {
    const id = setInterval(() => setFrame(f => (f === 3 ? 1 : f + 1)), 800)
    return () => clearInterval(id)
  }, [])

  // slow rocking side to side
  useEffect(() => {
    const el = animRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { rotation: -7, transformOrigin: '50% 90%' },
        { rotation: 7, duration: 2.5, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    gsap.killTweensOf(animRef.current)
    gsap.to(posRef.current, {
      rotation: 360,
      y: -(window.innerHeight + 200),
      duration: 1.0,
      ease: 'power2.in',
      onComplete: () => navigate('/skills'),
    })
  }

  return (
    <div
      ref={posRef}
      className="star-pos"
      style={style}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      aria-label="Go to Skills"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      <div ref={animRef} className="star-anim">
        <span className={`creature-tooltip star-tooltip${hovered ? ' creature-tooltip--visible' : ''}`}>
          Skills
        </span>
        <img
          src={`${BASE}creatures/star${frame}.png`}
          alt="Starfish"
          width={140}
          draggable={false}
          className={`star-img${hovered ? ' star-img--hovered' : ''}`}
        />
      </div>
    </div>
  )
}
