import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="apple-navbar">
      <div className="nav-brand">
        {/* Remplace par ton vrai nom */}
        <Link to="/">Corentin Commino.</Link> 
      </div>
      
      <div className="nav-links">
        <Link to="/">Accueil</Link>
        <Link to="/about">À propos</Link>
        <Link to="/projects">Projets</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  )
}
