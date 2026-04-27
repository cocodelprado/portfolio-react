# 🌐 Portfolio 3D — Corentin Commino

Bienvenue sur le code source de mon portfolio personnel interactif. Ce projet est une vitrine professionnelle construite avec React et Three.js, mêlant expériences 3D immersives, design Apple-inspired et fonctionnalités full-stack (formulaire de contact, QR Code, API GitHub).

🔗 **Live** : [portfolio-react-ruby-eta.vercel.app](https://portfolio-react-ruby-eta.vercel.app)

---

## ✨ Fonctionnalités

- **Scènes 3D interactives** — Modèles `.glb` hébergés sur Cloudinary (Commodore Amiga, cabine téléphonique, enseigne lumineuse) avec `Float`, `OrbitControls` et `autoRotate`
- **Effet pluie réaliste** — Système de particules `lineSegments` Three.js avec vitesses individuelles, dérive vent et reset aléatoire (page Contact)
- **Glassmorphism Apple-style** — Design system cohérent sur toutes les pages, police système `-apple-system`, `backdropFilter`
- **Galerie de projets hybride** — Fusion GitHub API + JSON local, filtres par entreprise, badges tech animés
- **Formulaire de contact Formspree** — Validation custom sans lib externe, erreurs inline, toasts succès/erreur, état loading
- **QR Code vCard** — `qrcode.react` pointant vers `/contact.vcf` avec bouton téléchargement desktop
- **Navigation React Router v6** — `NavLink` actifs, page 404, scroll top automatique
- **Déploiement CI/CD** — Push sur `main` → déploiement automatique Vercel

---

## 🛠️ Stack technique

| Catégorie | Technologies |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router DOM v6 |
| 3D | React Three Fiber, React Three Drei, Three.js |
| Styles | CSS-in-JS (inline styles), animations CSS custom |
| Données | GitHub API v3 + JSON local |
| Contact | Formspree |
| QR Code | qrcode.react v3 |
| Assets 3D | Cloudinary CDN |
| Déploiement | Vercel |

---

## 📁 Structure du projet
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── BadgeTech.jsx
│   ├── ContactForm.jsx
│   └── QRCodeWidget.jsx
├── pages/
│   ├── Home.jsx        ← Scène 3D enseigne + présentation
│   ├── About.jsx       ← Commodore Amiga 3D + skills
│   ├── Projects.jsx    ← Grille projets filtrée + globe réseau 3D
│   ├── Contact.jsx     ← Cabine téléphonique 3D + pluie + formulaire
│   └── NotFound.jsx
├── data/
│   └── projects.json
public/
├── cv.pdf
└── contact.vcf

---

## 🚀 Installation en local

```bash
# 1. Cloner le dépôt
git clone https://github.com/cocodelprado/portfolio-react.git
cd portfolio-react

# 2. Installer les dépendances
npm install

# 3. Créer le fichier d'environnement
cp .env.example .env
# → Renseigner VITE_FORMSPREE_URL dans .env

# 4. Lancer en développement
npm run dev
```

---

## 🔐 Variables d'environnement

```bash
# .env (ne jamais commiter)
VITE_FORMSPREE_URL=https://formspree.io/f/VOTRE_ID
```

> Sur Vercel : **Settings → Environment Variables** → ajouter `VITE_FORMSPREE_URL`

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Accueil — modèle 3D enseigne + présentation hero |
| `/about` | À propos — Commodore Amiga 3D + compétences |
| `/projects` | Projets — globe réseau 3D + galerie filtrée (Assure-MER / GREENTECH) |
| `/contact` | Contact — cabine téléphonique 3D + pluie + formulaire Formspree |
| `*` | 404 personnalisée |

---

## 👤 Auteur

**Corentin Commino**
Étudiant en BTS SIO / Développeur Front-End React — Promo 2025

- 🌐 [Portfolio](https://portfolio-react-ruby-eta.vercel.app)
- 💼 [GitHub](https://github.com/cocodelprado)

---

> Projet réalisé dans le cadre d'une évaluation React — vitrine professionnelle déployée en production.