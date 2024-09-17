// src/components/Manager.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import FoodManagement from "./FoodManagement";
import ManagerHeader from "../layout/ManagerHeader";
import OrderList from "./OrderList";

const Manager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user && user.username ==="admin") {
      setIsAuthenticated(true);
      setIsAdmin(true);
    } else {
      navigate('/manager-login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setIsAdmin(false);
    navigate('/login');
  };

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ManagerHeader onLogout={handleLogout} />
      <Routes>
        <Route path="food-management" element={<FoodManagement />} />
        <Route path="order-list" element={<OrderList />} />
      </Routes>
    </div>
  );
};

export default Manager;
