import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CookieConsent = () => {
  const [consentGiven, setConsentGiven] = useState(false);

  useEffect(() => {
    // Überprüfe, ob die Zustimmung bereits in den Cookies gespeichert ist
    const consentCookie = Cookies.get("cookieConsent");
    if (consentCookie === "true") {
      setConsentGiven(true);
    }
  }, []);

  const handleAccept = () => {
    // Setze den Cookie, wenn der Benutzer zustimmt
    Cookies.set("cookieConsent", "true", { expires: 14, sameSite: "Strict" });
    setConsentGiven(true);
  };

  // Wenn die Zustimmung gegeben ist, zeige nichts an
  if (consentGiven) {
    return null;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2>Wir benutzen Cookies</h2>
        <p>
          Diese Website verwendet essentielle Cookies, die für den Betrieb der
          Seite notwendig sind. Diese Cookies sind bereits aktiviert und können
          nicht deaktiviert werden.
        </p>
        <div style={styles.cookieList}>
          <label>
            <input type="checkbox" checked disabled /> Essentielle Cookies
          </label>
        </div>
        <button onClick={handleAccept} style={styles.button}>
          Zustimmen
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    maxWidth: "400px",
    width: "90%",
  },
  cookieList: {
    margin: "20px 0",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default CookieConsent;
