import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CategoriesPage from "./Pages/CategoriesPage";
import QuestionPage from "./Pages/QuestionPage";
import "./App.css";
import AddQuestionPage from "./Pages/AddQuestionsPage";
import AddQuestionTypePage from "./Pages/AddQuestionTypePage";

import { ApiProvider } from "./utils/APIprovider";

const App = () => {
  const [Category, setCategory] = useState(null);
  const [SubCategory, setSubCategory] = useState(null);

  useEffect(() => {
    setCategory("");
    setSubCategory("");
  }, []);

  return (
    <Router>
      <div> Navbar</div>
      <Routes>
        <Route path="/" element={<Navigate to="/categories" />} />
        <Route
          path="/categories"
          element={
            <ApiProvider>
              <CategoriesPage
                setCategory={setCategory}
                setSubCategory={setSubCategory}
              />
            </ApiProvider>
          }
        />
        <Route
          path="/questions"
          element={
            Category !== null && SubCategory !== null ? (
              <ApiProvider>
                <QuestionPage category={Category} subCategory={SubCategory} />
              </ApiProvider>
            ) : (
              <Navigate to="/categories" />
            )
          }
        />
        <Route
          path="/add-question"
          element={
            <ApiProvider>
              <AddQuestionPage />
            </ApiProvider>
          }
        />
        <Route
          path="/add-type"
          element={
            <ApiProvider>
              <AddQuestionTypePage />
            </ApiProvider>
          }
        />
        {/* nur für development */}
      </Routes>
    </Router>
  );
};

export default App;
