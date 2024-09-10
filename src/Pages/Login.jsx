import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2"; // Importiere SweetAlert2
import "./Login.css"; // Importiere die CSS-Datei
import { useApi } from "../utils/APIprovider";
import { useUser } from "../utils/UserProvider"; // Importiere den UserContext

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const apiBaseUrl = useApi();
  const { login } = useUser(); // Hole die login-Funktion aus dem UserContext

  // Funktion für den normalen Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        identifier,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Setze den Benutzer im Kontext (userId und name)
        login(response.data.userId, response.data.name);

        // Navigiere zum Dashboard
        navigate("/dashboard");
      }
    } catch (error) {
      // Zeige SweetAlert bei Fehler
      Swal.fire({
        icon: "error",
        title: "Login failed",
        text: "Invalid credentials. Please try again.",
        confirmButtonText: "Ok",
      });
    }
  };

  // Funktion für den Google-Login
  const handleGoogleLoginSuccess = async (response) => {
    try {
      const { credential } = response;
      const res = await axios.post(`${apiBaseUrl}/google-login`, {
        tokenId: credential,
      });
      localStorage.setItem("token", res.data.token);

      // Setze den Benutzer im Kontext für Google Login (userId und name)
      login(res.data.userId, res.data.name);

      // Navigiere zum Dashboard nach erfolgreichem Google Login
      navigate("/dashboard");
    } catch (error) {
      console.error("Google login failed:", error);
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

      {/* Google Login */}
      <div className="google-login-section">
        <h3>Or login with Google</h3>
        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => console.error("Google login error")}
        />
      </div>
    </div>
  );
};

export default Login;
