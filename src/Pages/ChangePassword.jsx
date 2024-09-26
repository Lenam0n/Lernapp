import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useApi } from "../utils/APIprovider";
import "./ChangePassword.css";
import { useUser } from "../utils/UserProvider";

const ChangePassword = () => {
  const { hash } = useParams(); // Den Hash aus der URL holen
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const apiBaseUrl = useApi();
  const navigate = useNavigate();
  const { logout } = useUser();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      Swal.fire("Fehler", "Bitte alle Felder ausfüllen", "error");
      return;
    }

    try {
      const response = await axios.post(
        `${apiBaseUrl}/auth/change-password/${hash}`,
        {
          currentPassword,
          newPassword,
        }
      );

      Swal.fire("Erfolgreich", response.data.message, "success");

      // Nach erfolgreicher Passwortänderung ausloggen und zur Login-Seite umleiten
      logout();
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data.message) {
        Swal.fire("Fehler", error.response.data.message, "error");
      } else {
        Swal.fire("Fehler", "Etwas ist schief gelaufen", "error");
      }
    }
  };

  return (
    <div className="change-password-container">
      <h2>Passwort ändern</h2>
      <form className="change-password-form" onSubmit={handleChangePassword}>
        <div>
          <label>Aktuelles Passwort </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Neues Passwort </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Passwort ändern</button>
      </form>
    </div>
  );
};

export default ChangePassword;
