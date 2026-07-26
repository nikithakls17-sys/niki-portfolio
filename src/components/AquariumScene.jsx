import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import useSound from 'use-sound'
import Jellyfish from './creatures/Jellyfish'
import TreasureChest from './creatures/TreasureChest'
import Starfish from './creatures/Starfish'
import PufferFish from './creatures/PufferFish'
import Turtle from './creatures/Turtle'
import { useSoundCtx } from '../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

// Two swimming schools — fish_heart is the hover crossfade target, not a swimmer
const FISH_SCHOOLS = [
  { src: 'fish_school1.png', top: '45%', duration: 22, delay: 0, width: 300 },
  { src: 'fish_school2.png', top: '55%', duration: 30, delay: 8, width: 300 },
]

// ── SVG scene data ────────────────────────────────────────────────────────────

// Triangular god-ray beams fanning from top-center origin (720, -80).
// Each polygon: apex → bottom-left → bottom-right
const GOD_RAYS = [
  { points: '720,-80  20,950  220,950',   opacity: 0.038 },
  { points: '720,-80  230,950  420,950',  opacity: 0.055 },
  { points: '720,-80  450,950  560,950',  opacity: 0.065 },
  { points: '720,-80  590,950  675,950',  opacity: 0.082 },
  { points: '720,-80  700,950  800,950',  opacity: 0.092 },
  { points: '720,-80  830,950  930,950',  opacity: 0.075 },
  { points: '720,-80  960,950  1080,950', opacity: 0.062 },
  { points: '720,-80 1110,950 1290,950',  opacity: 0.05  },
  { points: '720,-80 1310,950 1530,950',  opacity: 0.036 },
]

// Distant reef — hazy, low-contrast mounds fading into the water for depth
const CORAL_DISTANT = [
  {
    color: '#0e3350',
    d: `M 0,900 L 0,846 Q 90,828 170,838 Q 260,848 320,824
        Q 400,796 470,816 Q 540,834 610,812 L 610,900 Z`,
  },
  {
    color: '#123a58',
    d: `M 560,900 L 560,820 Q 640,792 720,810 Q 800,826 880,800
        Q 950,778 1020,802 L 1020,900 Z`,
  },
  {
    color: '#0e3350',
    d: `M 980,900 L 980,824 Q 1060,800 1150,820 Q 1240,838 1320,814
        Q 1390,792 1440,810 L 1440,900 Z`,
  },
]

// Far coral — full-width base silhouette, darkest layer
const CORAL_FAR = `
  M 0,900 L 0,836
  C  80,822  160,808  240,799
  C 320,789  400,803  480,791
  C 560,779  640,794  720,781
  C 800,768  880,783  960,770
  C 1040,756 1120,771 1200,758
  C 1280,744 1360,760 1440,747
  L 1440,900 Z
`

// Mid coral — warmer dark tones, more varied peaks
const CORAL_MID = [
  {
    color: '#14092a',
    d: `M 0,900 L 0,864 Q 38,850 62,832 Q 88,812 118,824
        Q 148,836 178,818 Q 208,800 244,812
        C 280,822 312,802 342,784 C 368,766 396,780 418,764
        L 445,900 Z`,
  },
  {
    color: '#1a0e24',
    d: `M 395,900 L 418,862 C 440,840 468,818 494,806
        C 520,794 546,808 566,793 C 586,778 606,764 624,752
        C 642,740 662,756 682,769 C 702,782 722,796 744,812
        L 762,900 Z`,
  },
  {
    color: '#160b26',
    d: `M 718,900 L 740,858 C 762,836 792,813 822,803
        C 852,793 882,806 912,793 C 942,780 964,766 994,756
        C 1024,746 1048,760 1072,774
        L 1104,900 Z`,
  },
  {
    color: '#1c1020',
    d: `M 1058,900 L 1090,854 C 1112,833 1142,812 1172,800
        C 1202,788 1232,803 1262,790 C 1292,778 1322,763 1362,753
        C 1382,748 1412,757 1440,745
        L 1440,900 Z`,
  },
]

// Remaining emoji-placeholder creatures
const CREATURES = [
  { id: 'seahorse', label: 'Connect', icon: '🌿', x: '84%', y: '50%' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function AquariumScene({ onCreatureClick }) {
  const navigate = useNavigate()
  const godRayRef    = useRef(null)
  const bubbleRefs   = useRef([])
  const creatureRefs = useRef([])
  const fishRefs      = useRef([])
  const fishTweens    = useRef([])
  const heartTimer    = useRef(null)
  const [heartFish, setHeartFish] = useState(null)
  const [seaweedGlowing, setSeaweedGlowing] = useState(false)

  const { isMusicMuted, isSfxMuted } = useSoundCtx()
  const ambientStarted = useRef(false)
  const ambientPlaying = useRef(false)

  const [playAmbient, { stop: stopAmbient }] = useSound(
    `${BASE}sounds/underwater background.mp3`,
    { loop: true, volume: 0.3, interrupt: false },
  )
  const [playCartoonBubble] = useSound(`${BASE}sounds/cartoon bubble.wav`, { volume: 0.6, interrupt: true })

  // Start ambient on first user interaction
  useEffect(() => {
    function onFirstInteraction() {
      if (ambientStarted.current) return
      ambientStarted.current = true
      if (!isMusicMuted) {
        playAmbient()
        ambientPlaying.current = true
      }
      document.removeEventListener('click', onFirstInteraction)
    }
    document.addEventListener('click', onFirstInteraction)
    return () => document.removeEventListener('click', onFirstInteraction)
  }, [playAmbient, isMusicMuted])

  // Stop/resume ambient when music mute toggles
  useEffect(() => {
    if (!ambientStarted.current) return
    if (!isMusicMuted && !ambientPlaying.current) {
      playAmbient()
      ambientPlaying.current = true
    } else if (isMusicMuted && ambientPlaying.current) {
      stopAmbient()
      ambientPlaying.current = false
    }
  }, [isMusicMuted, playAmbient, stopAmbient])

  function showHeart(i) {
    clearTimeout(heartTimer.current)
    fishTweens.current[i]?.pause()
    gsap.to(fishRefs.current[i], { opacity: 1, duration: 0.2 })
    setHeartFish(i)
    if (!isSfxMuted) playCartoonBubble()
  }

  function hideHeart(i) {
    clearTimeout(heartTimer.current)
    fishTweens.current[i]?.resume()
    gsap.to(fishRefs.current[i], { opacity: 0.85, duration: 0.3 })
    setHeartFish(null)
  }

  function clickHeart(i) {
    clearTimeout(heartTimer.current)
    fishTweens.current[i]?.pause()
    gsap.to(fishRefs.current[i], { opacity: 1, duration: 0.2 })
    setHeartFish(i)
    if (!isSfxMuted) playCartoonBubble()
    heartTimer.current = setTimeout(() => {
      fishTweens.current[i]?.resume()
      gsap.to(fishRefs.current[i], { opacity: 0.85, duration: 0.3 })
      setHeartFish(null)
    }, 2000)
  }

  useEffect(() => {
    const ctx = gsap.context(() => {

      // God rays — slow breathing pulse
      gsap.fromTo(
        godRayRef.current,
        { opacity: 0.42 },
        { opacity: 0.78, duration: 4.5, ease: 'sine.inOut', yoyo: true, repeat: -1 }
      )

      // Creatures — gentle idle float
      creatureRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.to(el, {
          y: 9 + (i % 3) * 4,
          duration: 2.4 + i * 0.38,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

      // Bubbles — rise from random bottom positions, staggered start
      bubbleRefs.current.forEach((el) => {
        if (!el) return

        const launch = () => {
          const vw   = window.innerWidth
          const vh   = window.innerHeight
          const size = Math.random() * 5.5 + 2.5
          const swayX = (Math.random() - 0.5) * 110

          gsap.set(el, {
            x: Math.random() * vw,
            y: vh + size + Math.random() * 120,
            width:  size,
            height: size,
            opacity: Math.random() * 0.32 + 0.1,
          })

          gsap.to(el, {
            y: -size - 20,
            x: `+=${swayX}`,
            duration: Math.random() * 10 + 8,
            ease: 'none',
            onComplete: launch,
          })
        }

        // Stagger bubble launches so they don't all appear at once
        setTimeout(launch, Math.random() * 16000)
      })

      // Background fish — swim left-to-right, loop continuously
      fishRefs.current.forEach((el, i) => {
        if (!el) return
        const { duration, delay, width } = FISH_SCHOOLS[i]
        const vw = window.innerWidth
        gsap.set(el, { opacity: 0.85 })
        fishTweens.current[i] = gsap.fromTo(
          el,
          { x: vw + width + 40 },
          { x: -(width + 40), duration, ease: 'none', repeat: -1, delay },
        )
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="aquarium-scene">

      {/* ── Background SVG: god rays · coral · seaweed ── */}
      <svg
        className="aquarium-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="surfaceGlow" cx="50%" cy="0%" r="62%">
            <stop offset="0%"   stopColor="#6ed8f8" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#6ed8f8" stopOpacity="0"    />
          </radialGradient>
          <radialGradient id="floorGlow" cx="50%" cy="100%" r="70%">
            <stop offset="0%"   stopColor="#1a5570" stopOpacity="0.22" />
            <stop offset="55%"  stopColor="#0d3a52" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0d3a52" stopOpacity="0"    />
          </radialGradient>
        </defs>

        {/* Diffuse surface light */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#surfaceGlow)" />

        {/* God rays */}
        <g ref={godRayRef} style={{ mixBlendMode: 'screen' }}>
          {GOD_RAYS.map((ray, i) => (
            <polygon
              key={i}
              points={ray.points}
              fill={`rgba(148, 222, 255, ${ray.opacity})`}
            />
          ))}
        </g>

        {/* Distant reef — hazy silhouettes for depth */}
        {CORAL_DISTANT.map((c, i) => (
          <path key={i} d={c.d} fill={c.color} opacity={0.55} />
        ))}

        {/* Ambient light pooling on the ocean floor */}
        <ellipse cx="720" cy="920" rx="820" ry="140" fill="url(#floorGlow)" />

        {/* Far coral layer */}
        <path d={CORAL_FAR} fill="#06131e" />

        {/* Mid coral layer */}
        {CORAL_MID.map((c, i) => (
          <path key={i} d={c.d} fill={c.color} />
        ))}

      </svg>

      {/* ── Background fish — swim RTL, crossfade to heart on hover/click ── */}
      <div className="fish-layer">
        {FISH_SCHOOLS.map((f, i) => (
          <div
            key={f.src}
            ref={el => { fishRefs.current[i] = el }}
            className="fish-group"
            style={{ top: f.top }}
            onMouseEnter={() => showHeart(i)}
            onMouseLeave={() => hideHeart(i)}
            onClick={() => clickHeart(i)}
          >
            <div className="fish-flip">
              <img
                src={`${BASE}creatures/${f.src}`}
                alt=""
                width={f.width}
                draggable={false}
                className={`fish-school-img${heartFish === i ? ' fish-school-img--hidden' : ''}`}
              />
              <img
                src={`${BASE}creatures/fish_heart.png`}
                alt=""
                width={f.width}
                draggable={false}
                className={`fish-heart-img${heartFish === i ? ' fish-heart-img--visible' : ''}`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ── Bubble particles ── */}
      <div className="bubbles-container" aria-hidden="true">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} ref={el => { bubbleRefs.current[i] = el }} className="bubble" />
        ))}
      </div>

      {/* ── Clickable creature placeholders ── */}
      <div className="creatures-layer">
        <Jellyfish     style={{ left: '48%', top: '30%' }} />
        <Starfish      style={{ left: '18%', top: '38%' }} />
        <PufferFish    style={{ left: '82%', top: '58%' }} />
        <Turtle        style={{ left: '22%', top: '70%' }} />
        <TreasureChest style={{ left: '78%', top: '78%', transform: 'translateX(-50%)' }} />

        {/* Seaweed click area — left seaweed column */}
        <button
          className="seaweed-click-area"
          style={{ left: '0%', top: '40%', width: '14%', height: '55%' }}
          onClick={() => navigate('/hobbies')}
          onMouseEnter={() => setSeaweedGlowing(true)}
          onMouseLeave={() => setSeaweedGlowing(false)}
          aria-label="Go to Hobbies"
        >
          <span className={`creature-tooltip seaweed-tooltip${seaweedGlowing ? ' creature-tooltip--visible' : ''}`}>
            Hobbies
          </span>
        </button>

        {CREATURES.map((c, i) => (
          <button
            key={c.id}
            ref={el => { creatureRefs.current[i] = el }}
            className="creature-btn"
            style={{ left: c.x, top: c.y }}
            onClick={() => onCreatureClick?.(c.id)}
            aria-label={`Go to ${c.label}`}
          >
            <span className="creature-icon">{c.icon}</span>
            <span className="creature-label">{c.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
