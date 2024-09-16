// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Home from './components/Home';
import Menu from './components/Menu';
import Login from './components/Login';
import Register from './components/Register';
import Cart from './components/Cart';
import Order from './components/Order';
import Payment from './components/Payment';
import Contact from './components/Contact';
import Account from './components/Account';
import Manager from './components/Manager';
import ManagerLogin from './components/ManagerLogin';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('access_token', token);
    setToken(token);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setIsLoggedIn(false);
  };

  const Layout = ({ children }) => {
    const location = useLocation();

    // Sử dụng includes để ẩn header/footer cho tất cả các đường dẫn bắt đầu với "/manager"
    const hideHeaderFooter = location.pathname.includes('/manager');

    return (
      <>
        {!hideHeaderFooter && <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />}
        {children}
        {!hideHeaderFooter && <Footer />}
      </>
    );
  };

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/manager/*" element={<Manager />} />
          <Route path="/manager-login" element={<ManagerLogin />} />

          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu isLoggedIn={isLoggedIn} />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<Order />} />
          <Route path="/payment-return" element={<Payment />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
