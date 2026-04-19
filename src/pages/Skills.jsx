import { useNavigate } from 'react-router-dom'

export default function Skills() {
  const navigate = useNavigate()
  return (
    <div className="ocean-page">
      <div className="page-content">
        <h1 className="page-title">Skills</h1>
        <p className="page-subtitle">Treasures collected from the deep&hellip;</p>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
      </div>
    </div>
  )
}
