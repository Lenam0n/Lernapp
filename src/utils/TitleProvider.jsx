import React from "react";
import { Helmet } from "react-helmet-async"; // Importiere Helmet von react-helmet-async

const TitleProvider = ({ title, description, children }) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
      </Helmet>
      {children} {/* Hier werden die Kindkomponenten gerendert */}
    </>
  );
};

export default TitleProvider;
