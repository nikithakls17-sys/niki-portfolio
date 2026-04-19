import { useNavigate } from 'react-router-dom'

const PROJECTS = [
  {
    title: 'UCM Admissions Agent',
    description:
      'Full-stack AI-powered admissions assistant for the University of Central Missouri. Supports both Undergraduate and Graduate admissions with real-time information.',
    tech: ['Next.js', 'React', 'Python', 'FastAPI', 'OpenAI GPT', 'SQLite', 'MCP'],
    github: 'https://github.com/nikithakls17-sys/ucm-admissions-agent',
  },
  {
    title: 'Desk Reservation System',
    description:
      'Full-stack workspace reservation system supporting multi-building desk booking, admin management, maintenance blockouts, and bulk reservation operations.',
    tech: ['React', 'TypeScript', 'Java', 'Spring Boot', 'H2 Database', 'REST API'],
    github: null,
  },
  {
    title: 'PixelDesk Pixelator',
    description:
      'Retro Win95-style pixel art converter with interactive object selection. Upload an image, click to select objects, and pixelate with a classic 90s aesthetic.',
    tech: ['React', 'Vite', 'Python', 'FastAPI', 'OpenCV GrabCut', 'Web Workers'],
    github: null,
  },
  {
    title: 'AI Evaluator',
    description:
      'Python-based interactive AI tutor that assesses student understanding through adaptive questioning, evaluates responses, and provides personalized learning recommendations.',
    tech: ['Python', 'OpenAI GPT', 'SQLite', 'openai-agents', 'uv'],
    github: 'https://github.com/nikithakls17-sys/ai-evaluator',
  },
  {
    title: 'Naruto Hand Sign Jutsu Activator',
    description:
      'Real-time Naruto hand sign recognition using your webcam. Perform hand signs to activate jutsu visual effects — Shadow Clone, Rasengan, Fireball, and Chidori.',
    tech: ['React', 'Vite', 'MediaPipe Hands', 'MediaPipe Selfie Segmentation', 'KNN Classifier'],
    github: null,
  },
]

function ProjectCard({ title, description, tech, github }) {
  return (
    <article className="project-card">
      <h3 className="project-card__title">{title}</h3>
      <p className="project-card__desc">{description}</p>
      <div className="project-card__tags">
        {tech.map(t => (
          <span key={t} className="tech-tag">{t}</span>
        ))}
      </div>
      {github && (
        <a
          href={github}
          target="_blank"
          rel="noopener noreferrer"
          className="github-btn"
        >
          View on GitHub →
        </a>
      )}
    </article>
  )
}

export default function Projects() {
  const navigate = useNavigate()

  return (
    <div className="ocean-page ocean-page--scroll">
      <div className="content-shell">
        <header className="content-header">
          <h1 className="page-title">Projects</h1>
          <button className="back-btn" onClick={() => navigate('/')}>← Back to the Ocean</button>
        </header>
        <div className="projects-grid">
          {PROJECTS.map(p => (
            <ProjectCard key={p.title} {...p} />
          ))}
        </div>
      </div>
    </div>
  )
}
