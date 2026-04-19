import { useNavigate } from 'react-router-dom'

export default function Certificates() {
  const navigate = useNavigate()
  return (
    <div className="ocean-page ocean-page--center">
      <div className="page-content">
        <h1 className="page-title">Certificates</h1>
        <p className="page-subtitle">Coming soon to these waters&hellip;</p>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
      </div>
    </div>
  )
}
