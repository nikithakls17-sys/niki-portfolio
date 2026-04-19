import { useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import AquariumScene from './components/AquariumScene'
import Projects from './pages/Projects'
import './App.css'

const SECTION_LABELS = {
  starfish: 'Skills & Technologies',
  crab:     'Certificates & Academics',
  treasure: "Author's Note",
  puffer:   'Hobbies & Interests',
  seahorse: 'Connect',
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </HashRouter>
  )
}
