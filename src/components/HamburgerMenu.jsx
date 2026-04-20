import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useSoundCtx } from '../contexts/SoundContext'

const GUIDE = [
  { icon: '🪼', name: 'Jellyfish',    path: '/projects',     section: 'Projects'      },
  { icon: '⭐', name: 'Starfish',      path: '/skills',       section: 'Skills'        },
  { icon: '📦', name: 'Treasure Box', path: '/about',        section: "Author's Note" },
  { icon: '🐢', name: 'Turtle',       path: '/certificates', section: 'Certificates'  },
  { icon: '🐡', name: 'Puffer Fish',  path: '/hobbies',      section: 'Hobbies'       },
  { icon: '🌿', name: 'Seaweed',      path: '/hobbies',      section: 'Hobbies'       },
  { icon: '🐟', name: 'Fish School',  path: null,            section: '♥ surprise!'   },
]

const QUICK_LINKS = [
  { label: 'Projects',      path: '/projects'     },
  { label: 'Skills',        path: '/skills'       },
  { label: "Author's Note", path: '/about'        },
  { label: 'Certificates',  path: '/certificates' },
  { label: 'Hobbies',       path: '/hobbies'      },
]

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false)
  const panelRef   = useRef(null)
  const overlayRef = useRef(null)
  const navigate   = useNavigate()
  const { soundEnabled, setSoundEnabled, volume, setVolume } = useSoundCtx()

  useEffect(() => {
    const panel   = panelRef.current
    const overlay = overlayRef.current
    if (open) {
      gsap.to(panel,   { x: 0,     duration: 0.38, ease: 'power3.out' })
      gsap.to(overlay, { opacity: 1, duration: 0.28,
        onStart: () => { overlay.style.pointerEvents = 'auto' },
      })
    } else {
      gsap.to(panel,   { x: '100%', duration: 0.30, ease: 'power2.in' })
      gsap.to(overlay, { opacity: 0, duration: 0.22,
        onComplete: () => { overlay.style.pointerEvents = 'none' },
      })
    }
  }, [open])

  function close() { setOpen(false) }

  function go(path) {
    if (!path) return
    close()
    setTimeout(() => navigate(path), 340)
  }

  return (
    <>
      {/* Hamburger button — always visible, right side, vertically centered */}
      <button
        className="hamburger-btn"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle menu"
      >
        ☰
      </button>

      {/* Click-outside backdrop */}
      <div
        ref={overlayRef}
        className="menu-overlay"
        style={{ opacity: 0, pointerEvents: 'none' }}
        onClick={close}
      />

      {/* Slide-in panel */}
      <div ref={panelRef} className="menu-panel" style={{ transform: 'translateX(100%)' }}>

        <div className="menu-header">
          <span className="menu-title">explore 🌊</span>
          <button className="menu-close-btn" onClick={close} aria-label="Close">✕</button>
        </div>

        <p className="menu-how-to">click or hover each creature!</p>

        {/* Creature guide */}
        <h3 className="menu-section-title">creature guide</h3>
        <div className="menu-guide">
          {GUIDE.map(({ icon, name, path, section }) => (
            <button
              key={name}
              className={`menu-guide-row${!path ? ' menu-guide-row--static' : ''}`}
              onClick={() => go(path)}
              disabled={!path}
            >
              <span className="menu-guide-icon">{icon}</span>
              <span className="menu-guide-name">{name}</span>
              <span className="menu-guide-arrow">──→</span>
              <span className="menu-guide-section">{section}</span>
            </button>
          ))}
        </div>

        {/* Quick links */}
        <h3 className="menu-section-title">quick links</h3>
        <div className="menu-pills">
          {QUICK_LINKS.map(({ label, path }) => (
            <button key={path} className="menu-pill" onClick={() => go(path)}>
              {label}
            </button>
          ))}
        </div>

        {/* Sound controls */}
        <h3 className="menu-section-title">sounds</h3>
        <div className="menu-sound">
          <button
            className={`menu-sound-toggle${soundEnabled ? '' : ' menu-sound-toggle--off'}`}
            onClick={() => setSoundEnabled(s => !s)}
          >
            {soundEnabled ? '🔊 Sounds ON' : '🔇 Sounds OFF'}
          </button>
          <div className="menu-volume-row">
            <span className="menu-volume-label">🔈</span>
            <input
              type="range"
              className="menu-volume-slider"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
            />
            <span className="menu-volume-label">🔊</span>
          </div>
        </div>

      </div>
    </>
  )
}
