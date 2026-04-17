import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="apple-navbar">
      <div className="nav-brand">
        <NavLink to="/">Corentin Commino.</NavLink>
      </div>

      <div className="nav-links">
        <NavLink to="/" end>Accueil</NavLink>
        <NavLink to="/about">À propos</NavLink>
        <NavLink to="/projects">Projets</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </div>
    </nav>
  )
}
