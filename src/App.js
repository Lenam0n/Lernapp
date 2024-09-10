import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CategoriesPage from "./Pages/CategoriesPage";
import QuestionPage from "./Pages/QuestionPage";
import AddQuestionPage from "./Pages/AddQuestionsPage";
import AddQuestionTypePage from "./Pages/AddQuestionTypePage";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";

import Navbar from "./container/Navbar";

import "./App.css";

import { ApiProvider } from "./utils/APIprovider";
import ProtectedRoute from "./utils/ProtectedRoute";
import RequireCategoryOrList from "./utils/RequireCategoryOrList";
import RedirectAfterLogin from "./utils/RedirectAfterLogin";
import QuestionsOverview from "./Pages/QuestionsOverview";

const App = () => {
  const [Category, setCategory] = useState(null);
  const [SubCategory, setSubCategory] = useState(null);
  const [selectedList, setselectedList] = useState(null);

  useEffect(() => {
    setCategory("");
    setSubCategory("");
  }, []);

  return (
    <div className="app-layout">
      <Router>
        <ProtectedRoute>
          <ApiProvider>
            <Navbar setCategory={setCategory} setSubCategory={setSubCategory} />
          </ApiProvider>
        </ProtectedRoute>
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/categories"
              element={
                <ProtectedRoute>
                  <ApiProvider>
                    <CategoriesPage
                      setCategory={setCategory}
                      setSubCategory={setSubCategory}
                    />
                  </ApiProvider>
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
                    <ApiProvider>
                      <QuestionPage
                        category={Category}
                        subCategory={SubCategory}
                        selectedList={selectedList}
                      />
                    </ApiProvider>
                  </RequireCategoryOrList>
                </ProtectedRoute>
              }
            />
            <Route
              path="/questions-overview"
              element={
                <ProtectedRoute>
                  <ApiProvider>
                    <QuestionsOverview />
                  </ApiProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-question"
              element={
                <ProtectedRoute>
                  <ApiProvider>
                    <AddQuestionPage />
                  </ApiProvider>
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-type"
              element={
                <ProtectedRoute>
                  <ApiProvider>
                    <AddQuestionTypePage />
                  </ApiProvider>
                </ProtectedRoute>
              }
            />
            {/* nur für development */}
            <Route
              path="/register"
              element={
                <RedirectAfterLogin>
                  <ApiProvider>
                    <Register />
                  </ApiProvider>
                </RedirectAfterLogin>
              }
            />
            <Route
              path="/login"
              element={
                <RedirectAfterLogin>
                  <ApiProvider>
                    <Login />
                  </ApiProvider>
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
      </Router>
    </div>
  );
};

export default App;
