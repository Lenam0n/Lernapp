import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useApi } from "../utils/APIprovider";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Ladezustand
  const apiBaseUrl = useApi();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = Cookies.get("token");
      if (token) {
        try {
          const storedUser = Cookies.get("user");
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;

          // Hole zusätzliche Daten, wie relevante Fragen und Playlisten
          const [relevantResponse, playlistsResponse] = await Promise.all([
            axios.get(`${apiBaseUrl}/relevant`),
            axios.get(`${apiBaseUrl}/playlists`),
          ]);

          const relevantQuestions =
            relevantResponse.data.relevant_questions || [];
          const playlists = playlistsResponse.data || [];

          // Benutzerzustand setzen
          setUser({
            ...parsedUser,
            relevant_questions: relevantQuestions,
            playlists: playlists,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false); // Ladezustand auf false setzen, nachdem die Daten geladen wurden
    };

    if (apiBaseUrl) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [apiBaseUrl]);

  const login = (userId, name) => {
    const userObj = { userId, name };
    setUser(userObj);
    Cookies.set("user", JSON.stringify(userObj), {
      expires: 1,
      sameSite: "Strict",
    });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    Cookies.remove("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
