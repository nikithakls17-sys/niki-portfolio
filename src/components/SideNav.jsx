import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { icon: '🪼', label: 'Projects',      path: '/projects' },
  { icon: '⭐', label: 'Skills',         path: '/skills'   },
  { icon: '📦', label: "Author's Note", path: '/about'    },
]

export default function SideNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className="side-nav" aria-label="Site navigation">
      {NAV_ITEMS.map(({ icon, label, path }) => (
        <button
          key={path}
          className={`side-nav-item${pathname === path ? ' side-nav-item--active' : ''}`}
          onClick={() => navigate(path)}
          aria-label={`Go to ${label}`}
        >
          <span className="side-nav-icon">{icon}</span>
          <span className="side-nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
