import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useApi } from "../utils/APIprovider";
import { useUser } from "../utils/UserProvider";

const AccountDelete = () => {
  const [hash, setHash] = useState(null);
  const navigate = useNavigate();
  const apiBaseUrl = useApi();
  const { logout } = useUser();

  // Hole den temporären Hash, wenn die Seite geladen wird
  useEffect(() => {
    const fetchDeleteHash = async () => {
      try {
        const response = await axios.get(
          `${apiBaseUrl}/auth/generate-delete-hash`
        );
        setHash(response.data.hash); // Speichere den Hash
      } catch (error) {
        // Wenn es einen Fehler gibt, leite den Benutzer zurück zur Account-Seite
        Swal.fire(
          "Fehler",
          "Du kannst deinen Account jetzt nicht löschen.",
          "error"
        );
        navigate("/account");
      }
    };

    fetchDeleteHash();
  }, [navigate]);

  // Funktion zum Löschen des Accounts
  const handleDeleteAccount = async () => {
    Swal.fire({
      title: "Bist du sicher?",
      text: "Dein Account wird dauerhaft gelöscht!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ja, löschen!",
      cancelButtonText: "Abbrechen",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Account löschen, wenn der Benutzer bestätigt
          await axios.delete(`${apiBaseUrl}/auth/delete-account/${hash}`);
          Swal.fire(
            "Gelöscht!",
            "Dein Account wurde erfolgreich gelöscht.",
            "success"
          ).then(logout());

          // Leite den Benutzer zur Login-Seite um, da er ausgeloggt wird
          navigate("/login");
        } catch (error) {
          Swal.fire(
            "Fehler",
            "Es gab ein Problem beim Löschen deines Accounts.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="delete-account-container">
      <h2>Account löschen</h2>
      <p>
        Sobald du deinen Account löschst, gibt es keine Möglichkeit, ihn
        wiederherzustellen. Bist du sicher, dass du fortfahren möchtest?
      </p>
      <button onClick={handleDeleteAccount} className="delete-account-button">
        Account löschen
      </button>
    </div>
  );
};

export default AccountDelete;
