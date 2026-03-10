import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/">Acceuil</NavLink>
                    </li>
                    <li>
                        <NavLink to="/projects">Projets</NavLink>
                    </li>
                    <li>
                        <NavLink to ="/about">A propos</NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact">Contact</NavLink>
                </li>
            </ul>
        </nav>
    );
}