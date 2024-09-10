import React from "react";
import { Navigate } from "react-router-dom";

const RequireCategoryOrList = ({
  category,
  subCategory,
  selectedList,
  children,
}) => {
  // Prüfe, ob entweder eine Liste oder Kategorie und Subkategorie gesetzt sind
  if (!selectedList && (!category || !subCategory)) {
    return <Navigate to="/categories" />;
  }

  // Wenn entweder die Liste oder die Kategorie und Subkategorie gesetzt sind, zeige die Kinderkomponente
  return children;
};

export default RequireCategoryOrList;
