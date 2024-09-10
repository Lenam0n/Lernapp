export const logout = () => {
  // Entferne das Token aus dem localStorage
  localStorage.removeItem("token");

  // Weiterleitung zur Login-Seite (kann angepasst werden, je nach Routing)
  window.location.href = "/login";
};
