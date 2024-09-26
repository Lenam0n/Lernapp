import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2"; // Importiere SweetAlert2
import "./Login.css"; // Importiere die CSS-Datei
import { useApi } from "../utils/APIprovider";
import { useUser } from "../utils/UserProvider"; // Importiere den UserContext
import Cookies from "js-cookie"; // Importiere js-cookie

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiBaseUrl = useApi();
  const { login } = useUser(); // Hole die login-Funktion aus dem UserContext

  // Funktion für den normalen Login
  const handleLogin = async (e) => {
    e.preventDefault(); // Verhindere das Standardverhalten des Formular-Submits
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        identifier,
        password,
      });
      //console.log("Login response:", response); // Für Debugging
      if (response.data.token) {
        // Setze das Token in den Cookies
        Cookies.set("token", response.data.token, {
          expires: 1, // Das Token läuft nach 1 Tag ab
          //secure: true, // Stelle sicher, dass der Cookie nur über HTTPS gesendet wird
          sameSite: "Strict", // Cross-Site-Anfragen verhindern
        });
        // Setze den Benutzer im Kontext (userId und name)

        login(response.data.userId, response.data.name);
        // Navigiere zum Dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      console.log("Fehler beim Login:", error); // Für Debugging

      // Zeige SweetAlert bei Fehler
      Swal.fire({
        icon: "error",
        title: "Login fehlgeschlagen",
        text: "Ungültige Anmeldeinformationen. Bitte versuche es erneut.",
        confirmButtonText: "Ok",
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {/* Normales Login-Formular */}
      <form className="login-form" onSubmit={handleLogin}>
        <div>
          <label>Username oder Email:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Google Login
      <div className="google-login-section">
        <h3>Oder mit Google anmelden</h3>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.error("Google login error")}
        />
      </div> */}
    </div>
  );
};

export default Login;
