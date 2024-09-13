import Cookies from "js-cookie"; // Importiere js-cookie

export const logout = () => {
  // Entferne das Token aus den Cookies
  Cookies.remove("token");

  // Weiterleitung zur Login-Seite (kann angepasst werden, je nach Routing)
  window.location.href = "/login";
};
