import React from "react";
import { useUser } from "../utils/UserProvider"; // Verwende den UserContext
import { useNavigate } from "react-router-dom"; // Für Navigation
import "./Home.css"; // Für einfache Styling-Anpassungen
import Footer from "../container/Footer";

const Home = () => {
  return (
    <div>
      {/* Custom Navbar für Home-Seite */}
      <HomeNavbar />

      {/* Header Section */}
      <section id="home-hero" className="home-section home-hero">
        <div className="home-container">
          <h1>Willkommen bei LumiQuest</h1>
          <p>Dein Quiz-Abenteuer beginnt hier!</p>
          <a href="#home-about" className="home-btn">
            Mehr erfahren
          </a>
        </div>
      </section>

      {/* About LumiQuest Section */}
      <section id="home-about" className="home-section">
        <div className="home-container">
          <h2>Über LumiQuest</h2>
          <p>
            LumiQuest ist eine Quiz-Plattform, die spannende Kategorien und
            interaktive Fragen bietet. Perfekt, um dein Wissen zu testen und
            neue Themen zu erkunden.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="home-features" className="home-section">
        <div className="home-container">
          <h2>Features</h2>
          <div className="home-features-list">
            <div className="home-feature-item">
              <h3>Vielfältige Kategorien</h3>
              <p>
                Wähle aus verschiedenen Kategorien wie Geschichte, Wissenschaft,
                und mehr.
              </p>
            </div>
            <div className="home-feature-item">
              <h3>Interaktive Fragen</h3>
              <p>
                Unsere Fragen sind interaktiv und ansprechend gestaltet, um dein
                Wissen herauszufordern.
              </p>
            </div>
            <div className="home-feature-item">
              <h3>Personalisierte Playlists</h3>
              <p>
                Erstelle deine eigenen Playlists mit Fragen, die dich
                interessieren.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="home-cta" className="home-section home-cta">
        <div className="home-container">
          <h2>Bereit loszulegen?</h2>
          <p>
            Melde dich an oder registriere dich, um dein LumiQuest-Abenteuer zu
            starten!
          </p>
          <a href="/register" className="home-btn">
            Jetzt registrieren
          </a>
          <a href="/login" className="home-btn home-btn-secondary">
            Anmelden
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Subkomponente für die Home Navbar
const HomeNavbar = () => {
  const { user, logout } = useUser(); // Greife auf den Benutzerzustand und die Logout-Funktion zu
  const navigate = useNavigate(); // Für die Navigation

  const handleLogout = () => {
    window.location.reload();
    logout();
  };

  return (
    <nav className="home-navbar">
      <ul>
        <li>
          <a href="#home-hero">Home</a>
        </li>
        <li>
          <a href="#home-about">Über uns</a>
        </li>
        <li>
          <a href="#home-features">Features</a>
        </li>
        <li>
          <a href="#home-cta">Jetzt starten</a>
        </li>
      </ul>
      <div className="home-auth-buttons">
        {user ? (
          // Wenn der Benutzer eingeloggt ist, zeige den Benutzernamen als Button und einen Logout-Button
          <>
            <button
              className="home-btn home-btn-small"
              onClick={() => navigate("/account")}
            >
              Willkommen, {user.name}
            </button>
            <button className="home-btn home-btn-small" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          // Wenn der Benutzer nicht eingeloggt ist, zeige Login und Register-Buttons
          <>
            <a href="/login" className="home-btn home-btn-small">
              Login
            </a>
            <a
              href="/register"
              className="home-btn home-btn-small home-btn-secondary"
            >
              Register
            </a>
          </>
        )}
      </div>
    </nav>
  );
};

export default Home;
