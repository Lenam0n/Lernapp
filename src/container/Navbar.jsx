import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FaHome,
  FaTachometerAlt,
  FaQuestionCircle,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaListAlt, // Icon für Prüfungsrelevant
  FaClipboardList, // Icon für Custom Listen
  FaPlus, // Icon für Neue Liste erstellen
} from "react-icons/fa"; // Icons importieren
import "./Navbar.css"; // CSS-Datei importieren
import { useApi } from "../utils/APIprovider";

const icons = {
  home: <FaHome className="icon" />,
  dashboard: <FaTachometerAlt className="icon" />,
  questions: <FaQuestionCircle className="icon" />,
  account: <FaUser className="icon" />,
  settings: <FaCog className="icon" />,
  logout: <FaSignOutAlt className="icon" />,
  examRelevant: <FaListAlt className="icon" />, // Prüfungsrelevant Icon
  customLists: <FaClipboardList className="icon" />, // Custom Listen Icon
  newList: <FaPlus className="icon" />, // Icon für Neue Liste erstellen
};

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [customLists, setCustomLists] = useState([]); // Custom Listen hinzufügen
  const [showCustomLists, setShowCustomLists] = useState(false); // Für Custom Listen Dropdown
  const [showCategories, setShowCategories] = useState(false); // Für Kategorien Dropdown
  const [hoveredCategory, setHoveredCategory] = useState(null); // Zum Aufklappen der Subkategorien
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const apiBaseUrl = useApi();

  // Kategorien und Playlists abrufen
  useEffect(() => {
    fetchCategories();
    fetchCustomLists();
  }, []);

  const token = localStorage.getItem("token"); // Hole das Token aus dem Local Storage

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/categories/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error) {
      console.error(
        "Fehler beim Abrufen der Kategorien:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const fetchCustomLists = async () => {
    try {
      const response = await axios.get(
        `${apiBaseUrl}/playlists/user-playlists`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Füge das Token im Header hinzu
        }
      );
      setCustomLists(response.data);
    } catch (error) {
      console.error("Fehler beim Abrufen der Playlists:", error);
    }
  };

  const handleCustomListClick = (listId) => {
    navigate(`/questions?list=${listId}`);
  };

  const handleCreateNewList = async () => {
    const { value: newListName } = await Swal.fire({
      title: "Neue Liste erstellen",
      input: "text",
      inputLabel: "Listenname",
      inputPlaceholder: "Gib den Namen der neuen Liste ein",
      showCancelButton: true,
      confirmButtonText: "Erstellen",
      cancelButtonText: "Abbrechen",
      inputValidator: (value) => {
        if (!value) {
          return "Bitte gib einen Namen für die Liste ein!";
        }
      },
    });

    if (newListName) {
      try {
        await axios.post(`${apiBaseUrl}/playlists/user-playlists/new`, {
          name: newListName,
        });
        fetchCustomLists(); // Aktualisiere die Playlists nach dem Hinzufügen der neuen Liste
        Swal.fire(
          "Erstellt!",
          `Die Liste "${newListName}" wurde erstellt.`,
          "success"
        );
      } catch (error) {
        console.error("Fehler beim Erstellen der neuen Liste:", error);
        Swal.fire(
          "Fehler!",
          "Die Liste konnte nicht erstellt werden.",
          "error"
        );
      }
    }
  };

  const handleCategoryClick = (category, subCategory) => {
    navigate(`/questions?category=${category}&subCategory=${subCategory}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      className={`custom-navbar ${isExpanded ? "expanded" : ""}`}
      onMouseEnter={() => {
        if (!isExpanded) setIsExpanded(true);
      }}
      onMouseLeave={() => {
        if (isExpanded) setIsExpanded(false);
      }}
    >
      <ul className="navbar-list">
        <li>
          <Link to="/home">
            {icons.home}
            {isExpanded && <span>Home</span>}
          </Link>
        </li>

        {/* Dashboard */}
        <li>
          <Link to="/dashboard">
            {icons.dashboard}
            {isExpanded && <span>Dashboard</span>}
          </Link>
        </li>

        {/* Prüfungsrelevant */}
        <li>
          <Link to="/exam-relevant">
            {icons.examRelevant}
            {isExpanded && <span>Prüfungsrelevant</span>}
          </Link>
        </li>

        {/* Kategorien Dropdown */}
        <li
          className="categories-dropdown"
          onMouseEnter={() => setShowCategories(true)}
          onMouseLeave={() => setShowCategories(false)}
        >
          <Link to="#">
            {icons.questions}
            {isExpanded && <span>Questions</span>}
          </Link>

          {showCategories && (
            <div className="categories-menu">
              {categories.map((category) => (
                <div
                  key={category.category}
                  onMouseEnter={() => setHoveredCategory(category.category)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="category-item"
                >
                  <span className="category-title">{category.category}</span>
                  {hoveredCategory === category.category && (
                    <div className="sub-dropdown">
                      {category.subCategories.map((subCategory) => (
                        <Link
                          to="#"
                          key={`${category.category} - ${subCategory}`}
                          className="sub-dropdown-item"
                          onClick={() =>
                            handleCategoryClick(category.category, subCategory)
                          }
                        >
                          {subCategory}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </li>

        {/* Custom Listen Dropdown */}
        <li
          className="custom-lists-dropdown"
          onMouseEnter={() => setShowCustomLists(true)}
          onMouseLeave={() => setShowCustomLists(false)}
        >
          <Link to="#">
            {icons.customLists}
            {isExpanded && <span>Custom Listen</span>}
          </Link>

          {showCustomLists && (
            <div className="custom-lists-menu">
              {customLists.length > 0 ? (
                customLists.map((list) => (
                  <Link
                    to="#"
                    key={list._id}
                    className="custom-list-item"
                    onClick={() => handleCustomListClick(list._id)}
                  >
                    {list.name}
                  </Link>
                ))
              ) : (
                <></> // Keine benutzerdefinierten Listen anzeigen
              )}
              {/* Neue Liste erstellen */}
              <Link
                to="#"
                className="custom-list-item"
                onClick={handleCreateNewList}
              >
                {icons.newList}
                {isExpanded && <span>Neue Liste erstellen</span>}
              </Link>
            </div>
          )}
        </li>

        <li>
          <Link to="/account">
            {icons.account}
            {isExpanded && <span>Account</span>}
          </Link>
        </li>
        <li>
          <Link to="/settings">
            {icons.settings}
            {isExpanded && <span>Settings</span>}
          </Link>
        </li>

        <li>
          <Link to="#" className="logout-button" onClick={logout}>
            {icons.logout}
            {isExpanded && <span>Logout</span>}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
