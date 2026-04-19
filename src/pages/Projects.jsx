import { useNavigate } from 'react-router-dom'

export default function Projects() {
  const navigate = useNavigate()

  return (
    <div className="projects-page">
      <div className="projects-content">
        <h1 className="projects-title">Projects</h1>
        <p className="projects-subtitle">Coming soon to these waters&hellip;</p>
        <button className="back-btn" onClick={() => navigate('/')}>
          ← Back to the Ocean
        </button>
      </div>
    </div>
  )
}
