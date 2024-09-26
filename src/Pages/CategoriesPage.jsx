import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CategorieButton from "../component/CategorieButton";
import CategorieHeader from "../component/CategorieHeader";
import Loading from "../component/Loading";
import NoQuestions from "../component/NoQuestions";
import HomeButton from "../component/HomeButton";
import "./CategoriesPage.css"; // Importiere die CSS-Datei

import { useApi } from "../utils/APIprovider";
import axios from "axios";

const CategoriesPage = () => {
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCategories, setHasCategories] = useState(true);
  const navigate = useNavigate();

  const apiBaseUrl = useApi();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/questions/categories`);
      const result = await response;

      if (result.status !== 200) {
        setHasCategories(false);
      } else {
        setAllCategories(result.data);
        setHasCategories(true);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setHasCategories(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const navigateToQuestions = (category, subCategory) => {
    navigate(`/questions/${category}/${subCategory}`);
  };

  return (
    <div className="categories-page-container">
      {loading ? (
        <div className="loading-container">
          <Loading /> {/* Loading-Komponente anzeigen, wenn geladen wird */}
        </div>
      ) : hasCategories ? (
        allCategories.map((categoryObj, objIndex) => {
          const { subCategories, category } = categoryObj;

          return (
            <div key={`${category}-${objIndex}`}>
              <div className="category-header-container">
                <CategorieHeader label={category} />
              </div>
              {Array.isArray(subCategories) && subCategories.length > 0 ? (
                <div className="subcategory-buttons-container">
                  {subCategories.map((subCategory, index) => (
                    <CategorieButton
                      key={`${category}-${index}`}
                      name={subCategory}
                      category={category}
                      subCategory={subCategory}
                      navigateToQuestions={navigateToQuestions}
                    />
                  ))}
                </div>
              ) : (
                <div className="no-subtopics">No subtopics available</div>
              )}
            </div>
          );
        })
      ) : (
        <>
          <NoQuestions />
          <div className="home-button-container">
            <HomeButton />
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesPage;
