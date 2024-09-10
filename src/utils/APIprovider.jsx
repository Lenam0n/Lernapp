import React, { createContext, useContext } from "react";

const ApiContext = createContext();

export const ApiProvider = ({ children }) => {
  //const apiBaseUrl = "http://192.168.178.177:3000";
  //const apiBaseUrl = "http://localhost:5000";
  //const apiBaseUrl = "http://backend:5000";
  const apiBaseUrl = "http://lumiquest_backend.lenam0n.net";

  return (
    <ApiContext.Provider value={apiBaseUrl}>{children}</ApiContext.Provider>
  );
};

export const useApi = () => useContext(ApiContext);
