import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import { useSoundCtx } from '../../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

const SMALL = 120
const BIG   = 220

export default function PufferFish({ style }) {
  const [frame, setFrame] = useState(2)
  const [isPuffed, setIsPuffed] = useState(false)
  const [isIdleBig, setIsIdleBig] = useState(false)
  const animRef     = useRef(null)
  const intervalRef = useRef(null)
  const clickedRef  = useRef(false)
  const navigate    = useNavigate()
  const { isSfxMuted } = useSoundCtx()

  const [playHover] = useSound(`${BASE}sounds/bubble deep.wav`, { volume: 0.6, interrupt: true })

  function startInterval() {
    let growing = true
    intervalRef.current = setInterval(() => {
      if (growing) {
        setFrame(1)
        setIsIdleBig(true)
      } else {
        setFrame(2)
        setIsIdleBig(false)
      }
      growing = !growing
    }, 3000)
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
        { rotation: -5, transformOrigin: '50% 90%' },
        { rotation: 5, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  function handleMouseEnter() {
    stopInterval()
    setFrame(1)
    setIsPuffed(true)
    if (!isSfxMuted) playHover()
  }

  function handleMouseLeave() {
    if (clickedRef.current) return
    setIsPuffed(false)
    setFrame(2)
    startInterval()
  }

  function handleClick() {
    if (clickedRef.current) return
    clickedRef.current = true
    setFrame(1)
    setIsPuffed(true)
    setTimeout(() => navigate('/hobbies'), 400)
  }

  const size = isPuffed ? BIG : (isIdleBig ? BIG : SMALL)

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

      <div ref={animRef} className="puffer-anim">
        <div
          className={`puffer-img-wrap${isPuffed ? ' puffer-img-wrap--hovered' : ''}`}
          style={{
            position: 'relative',
            width: size,
            height: size,
            transition: 'width 0.5s ease, height 0.5s ease',
          }}
        >
          <img
            src={`${BASE}creatures/puffer${frame}.png`}
            alt="Puffer fish"
            draggable={false}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>
    </div>
  )
}
