import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../utils/UserProvider"; // Importiere den UserContext

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser(); // Hole den Benutzer aus dem Context

  return (
    <div>
      <h2>Dashboard</h2>
      <p>
        {user
          ? `Welcome to your dashboard, ${user.name}!`
          : "Welcome to your dashboard!"}
      </p>
    </div>
  );
};

export default Dashboard;
