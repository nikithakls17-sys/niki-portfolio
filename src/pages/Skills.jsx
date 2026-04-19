import { useNavigate } from 'react-router-dom'

const SKILL_GROUPS = [
  {
    label: 'Languages',
    color: '#64d8f8',
    skills: ['Python', 'Java', 'JavaScript', 'TypeScript', 'SQL'],
  },
  {
    label: 'Frameworks',
    color: '#b88af8',
    skills: ['React', 'Next.js', 'Vite', 'FastAPI', 'Spring Boot'],
  },
  {
    label: 'AI / ML',
    color: '#f880c0',
    skills: ['OpenAI API', 'MediaPipe', 'KNN Classifier', 'MCP Protocol', 'OpenAI Agents'],
  },
  {
    label: 'Tools',
    color: '#7de8b0',
    skills: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA', 'SQLite', 'H2'],
  },
  {
    label: 'Other',
    color: '#f8c860',
    skills: ['REST APIs', 'Full Stack Development', 'Session Management'],
  },
]

function SkillGroup({ label, color, skills }) {
  return (
    <div className="skill-group">
      <h3 className="skill-group__label" style={{ color }}>{label}</h3>
      <div className="skill-group__pills">
        {skills.map(s => (
          <span
            key={s}
            className="skill-pill"
            style={{
              borderColor: `${color}55`,
              color,
              background: `${color}14`,
              boxShadow: `0 0 8px ${color}22`,
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Skills() {
  const navigate = useNavigate()

  return (
    <div className="ocean-page ocean-page--scroll">
      <div className="content-shell">
        <header className="content-header">
          <h1 className="page-title">Skills</h1>
          <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
        </header>
        <div className="skills-container">
          {SKILL_GROUPS.map(g => (
            <SkillGroup key={g.label} {...g} />
          ))}
        </div>
      </div>
    </div>
  )
}
