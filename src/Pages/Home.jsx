import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // Importiere die CSS-Datei
import { useUser } from "../utils/UserProvider"; // Importiere den UserContext

const Home = () => {
  const { user } = useUser(); // Hole den Benutzer aus dem Context

  return (
    <div className="home-container">
      <h1>Welcome to the Application</h1>
      <p>{user ? `Hello, ${user.name}!` : "Welcome, guest!"}</p>
      <p>This is your main dashboard. Here are some quick links to navigate:</p>

      <div className="home-links">
        <Link to="/categories" className="home-link">
          <button className="home-button">View Questions</button>
        </Link>
        <Link to="/questions" className="home-link">
          <button className="home-button">View All Questions</button>
        </Link>
        <Link to="/dashboard" className="home-link">
          <button className="home-button">Go to Dashboard</button>
        </Link>
        <Link to="/add-question" className="home-link">
          <button className="home-button">Add a Question</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
