import { useNavigate } from 'react-router-dom'

export default function Hobbies() {
  const navigate = useNavigate()
  return (
    <div className="ocean-page ocean-page--center">
      <div className="page-content">
        <h1 className="page-title">Hobbies</h1>
        <p className="page-subtitle">Coming soon to these waters&hellip;</p>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
      </div>
    </div>
  )
}
