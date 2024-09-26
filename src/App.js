import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { HelmetProvider } from "react-helmet-async";

import CategoriesPage from "./Pages/CategoriesPage";
import QuestionPage from "./Pages/QuestionPage";
import AddQuestionPage from "./Pages/AddQuestionsPage";
import AddQuestionTypePage from "./Pages/AddQuestionTypePage";
import Login from "./Pages/Login";
import { Logout } from "./Pages/Logout";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import QuestionsOverview from "./Pages/QuestionsOverview";
import PlaylistOverview from "./Pages/PlaylistOverview";
import Account from "./Pages/Account";
import ChangePassword from "./Pages/ChangePassword";
import AccountDelete from "./Pages/AccountDelete";
import TermsOfService from "./Pages/Terms";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

import Navbar from "./container/Navbar";

import "./App.css";

import { ApiProvider } from "./utils/APIprovider";
import ProtectedRoute from "./utils/ProtectedRoute";
import RedirectAfterLogin from "./utils/RedirectAfterLogin";
import { useUser } from "./utils/UserProvider";
import SessionManager from "./utils/SessionManager";
import TitleProvider from "./utils/TitleProvider";
import CookieConsent from "./utils/CookieConsent";
import Loading from "./component/Loading";

const App = () => {
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  // Überprüfen, ob der Benutzer eingeloggt ist (über Token)
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true); // Benutzer ist eingeloggt, wenn Token vorhanden ist
    }

    const consent = Cookies.get("cookieConsent");
    if (!consent) {
      setShowCookieConsent(true); // Zeige Cookie-Consent, wenn keine Zustimmung vorhanden ist
    }
  }, []);

  useEffect(() => {
    if (user) setLoading(false); // Lade-Status auf false setzen, sobald der User verfügbar ist
  }, [user]);

  const title = "LumiQuest";

  // Bedingte Anzeige: Wenn loading true ist, zeige den Loader, andernfalls die Inhalte.
  return (
    <div className={`app-layout ${isLoggedIn ? "with-sidebar" : "full-width"}`}>
      <HelmetProvider>
        <Router>
          {!loading && <AuthNavbar />}
          {showCookieConsent && <CookieConsent />}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/home" />} />
              {/* Home-Seite braucht keine ProtectedRoute */}
              <Route
                path="/home"
                element={
                  <TitleProvider
                    title={`${title} - Homepage`}
                    description="Willkommen auf der Startseite"
                  >
                    <Home />
                  </TitleProvider>
                }
              />
              {/* Login-Seite braucht keine ProtectedRoute */}
              <Route
                path="/login"
                element={
                  <RedirectAfterLogin>
                    <TitleProvider
                      title={`${title} - Login`}
                      description="Melde dich bei deinem Konto an"
                    >
                      <Login />
                    </TitleProvider>
                  </RedirectAfterLogin>
                }
              />
              <Route
                path="/categories"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Kategorien`}
                      description="Hier finden Sie alle Kategorien"
                    >
                      <CategoriesPage />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/questions-overview"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Fragen Übersicht`}
                      description="Alle Fragen im Überblick"
                    >
                      <QuestionsOverview />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/playlist-overview"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Playlist Übersicht`}
                      description="Alle Playlists im Überblick"
                    >
                      <PlaylistOverview />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-question"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Füge eine neue Frage hinzu`}
                      description="Füge eine neue Frage hinzu"
                    >
                      <AddQuestionPage />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-type"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Füge einen neuen Fragentyp hinzu`}
                      description="Füge einen neuen Fragetyp hinzu"
                    >
                      <AddQuestionTypePage />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <RedirectAfterLogin>
                    <TitleProvider
                      title={`${title} - Erstelle deinen Account`}
                      description="Erstelle ein neues Konto"
                    >
                      <Register />
                    </TitleProvider>
                  </RedirectAfterLogin>
                }
              />
              <Route
                path="/logout"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Logout`}
                      description="Melde dich ab"
                    >
                      <Logout />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account title={title} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <TitleProvider
                      title={`${title} - Dashboard`}
                      description="Dein persönliches Dashboard"
                    >
                      <Dashboard />
                    </TitleProvider>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/home" />} />
              <Route
                path="/questions/list/:listName"
                element={
                  <ProtectedRoute>
                    <SessionManager>
                      <QuestionPage title={title} />
                    </SessionManager>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/questions/relevant"
                element={
                  <ProtectedRoute>
                    <SessionManager>
                      <QuestionPage title={title} />
                    </SessionManager>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/questions/:category/:subCategory"
                element={
                  <ProtectedRoute>
                    <SessionManager>
                      <QuestionPage title={title} />
                    </SessionManager>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/change-password/:hash"
                element={
                  <ProtectedRoute>
                    <ChangePassword />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delete-account/:hash"
                element={
                  <ProtectedRoute>
                    <AccountDelete />
                  </ProtectedRoute>
                }
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </div>
        </Router>
      </HelmetProvider>
    </div>
  );
};

// AuthNavbar-Funktion zur Steuerung des Renderns der Navbar basierend auf dem Benutzerstatus
const AuthNavbar = () => {
  const { user, loading } = useUser(); // Greift auf den Benutzerzustand zu

  if (loading) {
    // Zeige nichts an, solange der Benutzerstatus nicht geladen ist
    return null;
  }

  // Navbar nur anzeigen, wenn ein Benutzer eingeloggt ist
  return !(user === null || user === undefined) ? <Navbar /> : null;
};

export default App;
