import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="ocean-page">
      <div className="page-content">
        <h1 className="page-title">Author&rsquo;s Note</h1>
        <p className="page-subtitle">A message from the deep&hellip;</p>
        <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
      </div>
    </div>
  )
}
