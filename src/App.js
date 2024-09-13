import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from "js-cookie";

import CategoriesPage from "./Pages/CategoriesPage";
import QuestionPage from "./Pages/QuestionPage";
import AddQuestionPage from "./Pages/AddQuestionsPage";
import AddQuestionTypePage from "./Pages/AddQuestionTypePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import QuestionsOverview from "./Pages/QuestionsOverview";

import Navbar from "./container/Navbar";

import "./App.css";

import { ApiProvider } from "./utils/APIprovider";
import ProtectedRoute from "./utils/ProtectedRoute";
import RequireCategoryOrList from "./utils/RequireCategoryOrList";
import RedirectAfterLogin from "./utils/RedirectAfterLogin";
import { UserProvider, useUser } from "./utils/UserProvider";

const App = () => {
  const [Category, setCategory] = useState(null);
  const [SubCategory, setSubCategory] = useState(null);
  const [selectedList, setselectedList] = useState(null);

  useEffect(() => {
    setCategory("");
    setSubCategory("");
    setselectedList("");
  }, []);

  return (
    <div className="app-layout">
      <Router>
        <UserProvider>
          <ApiProvider>
            {/* Navbar nur anzeigen, wenn der Benutzer eingeloggt ist */}
            <AuthNavbar
              setCategory={setCategory}
              setSubCategory={setSubCategory}
            />

            <div className="main-content">
              <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route
                  path="/categories"
                  element={
                    <ProtectedRoute>
                      <CategoriesPage
                        setCategory={setCategory}
                        setSubCategory={setSubCategory}
                      />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questions"
                  element={
                    <ProtectedRoute>
                      <RequireCategoryOrList
                        category={Category}
                        subCategory={SubCategory}
                        selectedList={selectedList}
                      >
                        <QuestionPage
                          category={Category}
                          subCategory={SubCategory}
                          selectedList={selectedList}
                        />
                      </RequireCategoryOrList>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/questions-overview"
                  element={
                    <ProtectedRoute>
                      <QuestionsOverview />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-question"
                  element={
                    <ProtectedRoute>
                      <AddQuestionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/add-type"
                  element={
                    <ProtectedRoute>
                      <AddQuestionTypePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <RedirectAfterLogin>
                      <Register />
                    </RedirectAfterLogin>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <RedirectAfterLogin>
                      <Login />
                    </RedirectAfterLogin>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </Routes>
            </div>
          </ApiProvider>
        </UserProvider>
      </Router>
    </div>
  );
};

// AuthNavbar-Funktion zur Steuerung des Renderns der Navbar basierend auf dem Benutzerstatus
const AuthNavbar = ({ setCategory, setSubCategory }) => {
  const { user } = useUser(); // Greift auf den Benutzerzustand zu
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token"); // Hol den Token aus den Cookies
    if (!token || token === undefined) {
      setLoading(false); // Kein Token bedeutet kein Benutzer
    } else {
      setLoading(false); // Token vorhanden, Benutzerstatus abrufen
    }
  }, []);

  if (loading) {
    // Zeige nichts an, solange der Benutzerstatus nicht geladen ist
    return null;
  }

  // Navbar nur anzeigen, wenn ein Benutzer eingeloggt ist
  return !(user === null || user === undefined) ? (
    <Navbar setCategory={setCategory} setSubCategory={setSubCategory} />
  ) : null;
};

export default App;
