import { useNavigate } from 'react-router-dom'

export default function About() {
  const navigate = useNavigate()

  return (
    <div className="ocean-page ocean-page--center">
      <div className="parchment-card">
        <div className="parchment-deco">📦</div>
        <p className="parchment-text">
          Hi! I&apos;m{' '}
          <strong className="parchment-name">Nikitha Kishore Avadootha</strong>, a Computer
          Science student at the University of Central Missouri. I love building things that
          blend creativity and technology — from AI tutors to pixel art converters to hand
          sign recognition systems.
        </p>
        <p className="parchment-text">
          When I&apos;m not coding, you&apos;ll find me drawing (yes, I drew all the
          creatures in this aquarium!), exploring new ideas, and finding ways to make
          technology more human.
        </p>
        <p className="parchment-text parchment-text--closing">
          Thanks for swimming through my portfolio 🪼
        </p>

        <div className="parchment-divider" />

        <div className="parchment-meta">
          <span className="parchment-uni">University of Central Missouri</span>
          <span className="parchment-major">B.S. Computer Science</span>
        </div>

        <div className="parchment-links">
          <a
            href="https://www.linkedin.com/in/nikitha-avadootha/"
            target="_blank"
            rel="noopener noreferrer"
            className="parchment-link parchment-link--linkedin"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/nikithakls17-sys"
            target="_blank"
            rel="noopener noreferrer"
            className="parchment-link parchment-link--github"
          >
            GitHub
          </a>
        </div>

        <button className="back-btn parchment-back" onClick={() => navigate('/')}>
          ← Back to the Ocean
        </button>
      </div>
    </div>
  )
}
