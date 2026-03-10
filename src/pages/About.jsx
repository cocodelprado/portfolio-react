import Spline from '@splinetool/react-spline';

export default function About() {
  return (
    <div className="about-container">
      <h1>À propos de moi</h1>
      <p>Bienvenue dans mon univers interactif.</p>
      
      {/* Le conteneur du présentoir 3D */}
      <div className="spline-wrapper">
        <Spline scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" />
      </div>
    </div>
  );
}
