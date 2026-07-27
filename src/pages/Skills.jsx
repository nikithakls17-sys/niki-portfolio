import { useNavigate } from 'react-router-dom'

const SKILL_GROUPS = [
  {
    label: 'Languages',
    color: '#64d8f8',
    skills: ['Python', 'JavaScript', 'TypeScript', 'Java', 'SQL', 'C#', 'C', 'C++', 'HTML', 'CSS'],
  },
  {
    label: 'AI & Data',
    color: '#f880c0',
    skills: ['OpenAI Agents SDK', 'Cohere API', 'RAG Pipelines', 'Model Context Protocol', 'LLM Tool-Calling', 'Power BI', 'Tableau', 'pandas', 'ETL'],
  },
  {
    label: 'Web & APIs',
    color: '#b88af8',
    skills: ['React', 'Next.js', 'FastAPI', 'Spring Boot', 'REST APIs', 'Node.js', 'Microservices', 'OOP/OOD'],
  },
  {
    label: 'Cloud & Tools',
    color: '#7de8b0',
    skills: ['AWS Concepts', 'Azure (Learning)', 'Git/GitHub', 'CI/CD', 'MySQL', 'PostgreSQL', 'SQLite', 'MongoDB', 'Agile/Scrum'],
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
    <div className="ocean-page">
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
