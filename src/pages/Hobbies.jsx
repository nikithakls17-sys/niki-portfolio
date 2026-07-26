import { useNavigate } from 'react-router-dom'

export default function Hobbies() {
  const navigate = useNavigate()
  return (
    <div className="ocean-page ocean-page--scroll">
      <div className="content-shell">
        <header className="content-header">
          <h1 className="page-title">Hobbies</h1>
          <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
        </header>
        <p className="page-subtitle">Coming soon to these waters&hellip;</p>
      </div>
    </div>
  )
}
