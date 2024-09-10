import React, { createContext, useState, useContext } from "react";

// UserContext erstellen
export const UserContext = createContext();

// UserProvider-Komponente
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Benutzer-Status (null, wenn nicht eingeloggt)

  // login-Funktion, die userId und name setzt
  const login = (userId, name) => {
    setUser({ userId, name }); // Setze den Benutzer mit userId und name
  };

  // logout-Funktion, die den Benutzerzustand zurücksetzt
  const logout = () => {
    setUser(null); // Benutzer ausloggen
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom Hook für einfacheren Zugriff auf den UserContext
export const useUser = () => useContext(UserContext);
