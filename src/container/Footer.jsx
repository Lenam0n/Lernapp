import React, { useState } from "react";
import { FaDiscord, FaEnvelope } from "react-icons/fa"; // Discord and Email icons
import { AiOutlineDiscord } from "react-icons/ai";
import { Link } from "react-router-dom"; // For routing to pages
import "./Footer.css"; // For unique styles

const Footer = () => {
  const [copied, setCopied] = useState(false); // Zustand für Kopier-Indikator

  const handleDiscordUsernameCopy = () => {
    // Kopiere den Discord-Benutzernamen in die Zwischenablage
    navigator.clipboard.writeText("Lena_x3").then(() => {
      setCopied(true); // Setze den Zustand auf "kopiert"
      setTimeout(() => setCopied(false), 3000); // Nach 2 Sekunden wieder zurücksetzen
    });
  };

  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Branding Section */}
        <div className="footer-section">
          <h3 className="footer-title">LumiQuest</h3>
          <p>© 2024 LumiQuest. Alle Rechte vorbehalten.</p>
        </div>

        {/* Important Links Section */}
        <div className="footer-section">
          <h3 className="footer-title">Wichtige Links</h3>
          <ul className="footer-links">
            <li>
              <Link to="/privacy-policy">Datenschutzrichtlinie</Link>
            </li>
            <li>
              <Link to="/terms-of-service">Nutzungsbedingungen</Link>
            </li>
            <li>
              <Link to="/impressum">Impressum</Link>
            </li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="footer-section">
          <h3 className="footer-title">Kontakt</h3>
          <ul className="footer-contact">
            <li
              onClick={handleDiscordUsernameCopy}
              className="footer-contact-item"
              style={{ position: "relative" }} // Relative positioning for the container
            >
              <FaDiscord className="footer-icon" />
              <span>Lena_x3</span>
              {copied && <span className="copy-indicator">Kopiert!</span>}
            </li>
            <li className="footer-contact-item">
              <AiOutlineDiscord className="footer-icon" />
              <a
                href="https://discord.gg/JtY739u6"
                target="_blank"
                rel="noopener noreferrer"
              >
                Tritt unserem Discord-Server bei
              </a>
            </li>
            <li className="footer-contact-item">
              <FaEnvelope className="footer-icon" />
              <a href="mailto:support@lumiquest.com">support@lumiquest.com</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
