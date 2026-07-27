import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { SoundProvider } from './contexts/SoundContext'
import { useSoundCtx } from './contexts/useSoundCtx'
import AquariumScene from './components/AquariumScene'
import HamburgerMenu from './components/HamburgerMenu'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import About from './pages/About'
import Certificates from './pages/Certificates'
import Hobbies from './pages/Hobbies'
import './App.css'

// Ambient music only plays on the home scene — stop it everywhere else
function AmbientRouteSync() {
  const { pathname } = useLocation()
  const { setHomeActive } = useSoundCtx()

  useEffect(() => {
    setHomeActive(pathname === '/')
  }, [pathname, setHomeActive])

  return null
}

export default function App() {
  return (
    <HashRouter>
      <SoundProvider>
        <AmbientRouteSync />
        <HamburgerMenu />
        <Routes>
          <Route path="/"             element={<AquariumScene />} />
          <Route path="/projects"     element={<Projects />}     />
          <Route path="/skills"       element={<Skills />}       />
          <Route path="/about"        element={<About />}        />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/hobbies"      element={<Hobbies />}      />
        </Routes>
      </SoundProvider>
    </HashRouter>
  )
}
