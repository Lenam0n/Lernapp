import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CategorieButton from "../component/categorieButton";
import CategorieHeader from "../component/categorieHeader";
import Loading from "../component/Loading";

import { useApi } from "../utils/APIprovider";

const CategoriesPage = ({ setCategory, setSubCategory }) => {
  const [allCategories, setallCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const apiBaseUrl = useApi(); // Zugriff auf die API-Adresse

  const fetchCategories = async () => {
    try {
      const result = await (await fetch(`${apiBaseUrl}/categories`)).json();
      //backend muss null bei nichts rausgeben ausgeben

      setallCategories(result === null ? {} : result);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const navigateToQuestions = () => {
    navigate(`/questions`);
  };

  return (
    <div>
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          {allCategories.map((categoryObj, objIndex) => {
            const { subCategories, category } = categoryObj; // 'category' und 'subCategories' destructuren

            return (
              <div key={`${category}-${objIndex}`}>
                <CategorieHeader label={category} />
                {Array.isArray(subCategories) && subCategories.length > 0 ? (
                  subCategories.map((subCategory, index) => (
                    <CategorieButton
                      key={`${category}-${index}`} // Unique Key kombinierend aus category und index
                      name={subCategory} // Da subCategory ein String ist
                      category={category} // Kategorie wird übergeben
                      subCategory={subCategory} // subCategory ist der String-Wert selbst
                      setSubCategory={setSubCategory}
                      setCategory={setCategory}
                      navigateToQuestions={navigateToQuestions}
                    />
                  ))
                ) : (
                  <div>No subtopics available</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
