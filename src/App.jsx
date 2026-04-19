import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AquariumScene from './components/AquariumScene'
import SideNav from './components/SideNav'
import Projects from './pages/Projects'
import Skills from './pages/Skills'
import About from './pages/About'
import Certificates from './pages/Certificates'
import Hobbies from './pages/Hobbies'
import './App.css'

const SECTION_LABELS = {
  puffer:   'Hobbies & Interests',
  seahorse: 'Connect',
  crab:     'Certificates & Academics',
}

function Home() {
  const [activeSection, setActiveSection] = useState(null)

  return (
    <>
      <AquariumScene onCreatureClick={setActiveSection} />
      {activeSection && (
        <div className="section-overlay">
          <h2>{SECTION_LABELS[activeSection] ?? activeSection}</h2>
          <button className="back-btn" onClick={() => setActiveSection(null)}>
            ← Back to the Ocean
          </button>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <SideNav />
      <Routes>
        <Route path="/"             element={<Home />}         />
        <Route path="/projects"     element={<Projects />}     />
        <Route path="/skills"       element={<Skills />}       />
        <Route path="/about"        element={<About />}        />
        <Route path="/certificates" element={<Certificates />} />
        <Route path="/hobbies"      element={<Hobbies />}      />
      </Routes>
    </HashRouter>
  )
}
