import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

// UserContext erstellen
export const UserContext = createContext();

// UserProvider-Komponente
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Benutzer-Status (null, wenn nicht eingeloggt)
  useEffect(() => {
    const storedUser = Cookies.get("user"); // Hole den Cookie "user"
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Parse den Cookie, da er als String gespeichert wird
        setUser(parsedUser); // Setze den Benutzerzustand
      } catch (error) {
        console.error("Error parsing user from cookie", error);
      }
    }
  }, []); // Der leere Array stellt sicher, dass dieser Effekt nur einmal ausgeführt wird.

  // login-Funktion, die userId und name setzt
  const login = (userId, name) => {
    const userObj = { userId, name }; // Erstelle ein User-Objekt
    setUser(userObj); // Setze den Benutzerzustand
    Cookies.set("user", JSON.stringify(userObj), {
      expires: 1, // Das Token läuft nach 1 Tag ab
      //secure: true, // Stelle sicher, dass der Cookie nur über HTTPS gesendet wird
      sameSite: "Strict", // Cross-Site-Anfragen verhindern
    });
  };

  // logout-Funktion, die den Benutzerzustand zurücksetzt
  const logout = () => {
    setUser(null); // Benutzer ausloggen
    Cookies.remove("user"); // Entferne den Cookie
    Cookies.remove("token");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook für einfacheren Zugriff auf den UserContext
export const useUser = () => useContext(UserContext);
