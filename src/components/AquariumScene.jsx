import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import useSound from 'use-sound'
import Jellyfish from './creatures/Jellyfish'
import TreasureChest from './creatures/TreasureChest'
import Starfish from './creatures/Starfish'
import { useSoundCtx } from '../contexts/SoundContext'

const BASE = import.meta.env.BASE_URL

// Two swimming schools — fish_heart is the hover crossfade target, not a swimmer
const FISH_SCHOOLS = [
  { src: 'fish_school1.png', top: '28%', duration: 22, delay: 0, width: 300 },
  { src: 'fish_school2.png', top: '44%', duration: 30, delay: 8, width: 300 },
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

// Near coral — colorful front-layer formations
const CORAL_NEAR = [
  // Far-left orange-red cluster
  {
    color: '#c24e2c',
    d: `M 0,900 C 0,876 14,852 34,832 C 54,812 74,792 96,775
        C 118,758 134,743 148,760 C 162,777 172,796 188,818
        C 204,840 214,862 226,880 L 246,900 Z`,
  },
  // Left dark-rose coral
  {
    color: '#9e2646',
    d: `M 165,900 C 174,880 186,860 206,840 C 226,820 248,800 264,786
        C 280,772 294,760 304,775 C 314,790 318,812 322,834
        L 338,900 Z`,
  },
  // Left-center purple coral
  {
    color: '#6c2e9e',
    d: `M 294,900 L 314,866 C 330,846 350,826 370,810
        C 390,794 407,783 420,797 C 433,811 440,832 446,854
        L 464,900 Z`,
  },
  // Center-left warm pink
  {
    color: '#cc4678',
    d: `M 424,900 L 450,860 C 466,840 488,818 514,804
        C 540,790 559,778 574,792 C 589,806 594,830 600,852
        L 618,900 Z`,
  },
  // Center golden-amber coral
  {
    color: '#be7624',
    d: `M 566,900 L 588,866 C 608,844 630,822 654,810
        C 678,798 698,788 714,801 C 730,814 735,835 740,858
        L 756,900 Z`,
  },
  // Center rose coral (tallest, focal point)
  {
    color: '#b42e5e',
    d: `M 714,900 L 736,858 C 756,836 780,814 808,801
        C 836,788 856,778 872,791 C 888,804 892,828 898,852
        L 916,900 Z`,
  },
  // Right-center orange coral
  {
    color: '#cc5626',
    d: `M 866,900 L 890,858 C 912,836 936,812 962,798
        C 988,784 1008,776 1024,790 C 1040,804 1044,828 1050,852
        L 1068,900 Z`,
  },
  // Right purple-violet coral
  {
    color: '#64269e',
    d: `M 1018,900 L 1042,856 C 1064,832 1090,808 1118,795
        C 1146,782 1166,774 1182,788 C 1198,802 1203,826 1208,850
        L 1228,900 Z`,
  },
  // Right warm-pink cluster
  {
    color: '#be3668',
    d: `M 1178,900 C 1183,880 1198,860 1218,840 C 1238,820 1260,802 1278,790
        C 1296,778 1310,768 1322,782 C 1334,796 1338,818 1344,842
        L 1360,900 Z`,
  },
  // Far-right orange
  {
    color: '#c45e2e',
    d: `M 1312,900 C 1318,876 1336,856 1360,838 C 1384,820 1408,804 1428,796
        C 1440,791 1440,800 1440,820 L 1440,900 Z`,
  },
]

// Left seaweed blades — wavy strokes anchored at y=900
const SEAWEED_LEFT = [
  { color: '#0c4e32', width: 7, d: 'M  45,900 C  32,870  58,845  40,818 C  22,791  50,765  33,738 C  16,711  44,686  28,660 C  12,634  38,610  22,588' },
  { color: '#0a4830', width: 6, d: 'M  88,900 C  78,872 100,848  86,820 C  72,792  96,768  80,742 C  64,716  90,692  74,668 C  58,644  82,622  66,600' },
  { color: '#105e3e', width: 7, d: 'M 138,900 C 128,878 152,855 136,830 C 120,805 145,782 128,758 C 111,734 138,712 120,688 C 102,664 128,645 112,625' },
  { color: '#0c5434', width: 5, d: 'M 182,900 C 172,880 192,860 178,838 C 164,816 186,796 172,774 C 158,752 176,734 164,714 C 152,694 170,678 158,660' },
  { color: '#0a4830', width: 5, d: 'M 224,900 C 216,882 230,862 218,842 C 206,822 224,804 212,784 C 200,764 216,748 206,730' },
]

// Right seaweed blades — mirror of left side
const SEAWEED_RIGHT = [
  { color: '#0c4e32', width: 7, d: 'M 1395,900 C 1408,870 1382,845 1400,818 C 1418,791 1390,765 1407,738 C 1424,711 1396,686 1412,660 C 1428,634 1402,610 1418,588' },
  { color: '#105e3e', width: 6, d: 'M 1352,900 C 1362,872 1340,848 1354,820 C 1368,792 1344,768 1360,742 C 1376,716 1350,692 1366,668 C 1382,644 1358,622 1374,600' },
  { color: '#0a4830', width: 7, d: 'M 1302,900 C 1312,878 1288,855 1304,830 C 1320,805 1295,782 1312,758 C 1329,734 1302,712 1320,688 C 1338,664 1312,645 1328,625' },
  { color: '#0c5434', width: 5, d: 'M 1258,900 C 1268,880 1248,860 1262,838 C 1276,816 1254,796 1268,774 C 1282,752 1264,734 1276,714 C 1288,694 1270,678 1282,660' },
  { color: '#0a4830', width: 5, d: 'M 1216,900 C 1224,882 1210,862 1222,842 C 1234,822 1216,804 1228,784 C 1240,764 1224,748 1234,730' },
]

// Remaining emoji-placeholder creatures (starfish + treasure are now real components)
const CREATURES = [
  { id: 'puffer',   label: 'Hobbies',       icon: '🐡', x: '72%', y: '22%' },
  { id: 'seahorse', label: 'Connect',       icon: '🌿', x: '84%', y: '50%' },
  { id: 'crab',     label: 'Certificates', icon: '🦀', x: '18%', y: '66%' },
]

// ── Component ─────────────────────────────────────────────────────────────────

export default function AquariumScene({ onCreatureClick }) {
  const godRayRef    = useRef(null)
  const seaweedRefs  = useRef([])
  const bubbleRefs   = useRef([])
  const creatureRefs = useRef([])
  const fishRefs      = useRef([])
  const fishTweens    = useRef([])
  const heartTimer    = useRef(null)
  const [heartFish, setHeartFish] = useState(null)

  const { soundEnabled } = useSoundCtx()
  const ambientStarted = useRef(false)
  const ambientPlaying = useRef(false)

  const [playAmbient, { stop: stopAmbient }] = useSound(
    `${BASE}sounds/underwater background.mp3`,
    { loop: true, volume: 0.3, interrupt: false },
  )
  const [playCartoonBubble] = useSound(`${BASE}sounds/cartoon bubble.wav`, { volume: 0.6, interrupt: true })
  const [playBubbleDeepCrab]   = useSound(`${BASE}sounds/bubble deep.wav`, { volume: 0.7, interrupt: true })
  const [playBubbleDeepPuffer] = useSound(`${BASE}sounds/bubble deep.wav`, { volume: 0.6, interrupt: true })

  // Start ambient on first user click anywhere
  useEffect(() => {
    function onFirstInteraction() {
      if (ambientStarted.current) return
      ambientStarted.current = true
      if (soundEnabled) {
        playAmbient()
        ambientPlaying.current = true
      }
      document.removeEventListener('click', onFirstInteraction)
    }
    document.addEventListener('click', onFirstInteraction)
    return () => document.removeEventListener('click', onFirstInteraction)
  }, [soundEnabled, playAmbient])

  // Respond to mute/unmute after ambient has started
  useEffect(() => {
    if (!ambientStarted.current) return
    if (soundEnabled && !ambientPlaying.current) {
      playAmbient()
      ambientPlaying.current = true
    } else if (!soundEnabled && ambientPlaying.current) {
      stopAmbient()
      ambientPlaying.current = false
    }
  }, [soundEnabled, playAmbient, stopAmbient])

  function showHeart(i) {
    clearTimeout(heartTimer.current)
    fishTweens.current[i]?.pause()
    gsap.to(fishRefs.current[i], { opacity: 1, duration: 0.2 })
    setHeartFish(i)
    if (soundEnabled) playCartoonBubble()
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
    if (soundEnabled) playCartoonBubble()
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

      // Seaweed — sway from base, alternating direction
      seaweedRefs.current.forEach((el, i) => {
        if (!el) return
        const sign = i % 2 === 0 ? 1 : -1
        gsap.to(el, {
          rotation: sign * (3.5 + (i % 3) * 0.8),
          transformOrigin: '50% 100%',
          duration: 2.0 + i * 0.22,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        })
      })

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
          <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#183848" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#08141e" stopOpacity="1"    />
          </linearGradient>
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

        {/* Seafloor base */}
        <ellipse cx="720" cy="924" rx="1080" ry="62" fill="url(#floorGrad)" />

        {/* Far coral layer */}
        <path d={CORAL_FAR} fill="#06131e" />

        {/* Mid coral layer */}
        {CORAL_MID.map((c, i) => (
          <path key={i} d={c.d} fill={c.color} />
        ))}

        {/* Near coral layer */}
        {CORAL_NEAR.map((c, i) => (
          <path key={i} d={c.d} fill={c.color} />
        ))}

        {/* Left seaweed */}
        {SEAWEED_LEFT.map((sw, i) => (
          <g key={`sl-${i}`} ref={el => { seaweedRefs.current[i] = el }}>
            <path
              d={sw.d}
              stroke={sw.color}
              strokeWidth={sw.width}
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ))}

        {/* Right seaweed */}
        {SEAWEED_RIGHT.map((sw, i) => (
          <g key={`sr-${i}`} ref={el => { seaweedRefs.current[SEAWEED_LEFT.length + i] = el }}>
            <path
              d={sw.d}
              stroke={sw.color}
              strokeWidth={sw.width}
              strokeLinecap="round"
              fill="none"
            />
          </g>
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
        <Jellyfish     style={{ left: '50%', top: '20%'  }} />
        <TreasureChest style={{ left: '10%', bottom: '12%', transform: 'translateX(-50%)' }} />
        <Starfish      style={{ left: '74%', top: '68%'  }} />

        {CREATURES.map((c, i) => (
          <button
            key={c.id}
            ref={el => { creatureRefs.current[i] = el }}
            className="creature-btn"
            style={{ left: c.x, top: c.y }}
            onClick={() => {
              if (soundEnabled) {
                if (c.id === 'crab')   playBubbleDeepCrab()
                if (c.id === 'puffer') playBubbleDeepPuffer()
              }
              onCreatureClick?.(c.id)
            }}
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
