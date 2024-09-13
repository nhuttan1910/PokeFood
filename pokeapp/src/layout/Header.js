import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCartShopping, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Header = ({ isLoggedIn, onLogout }) => {
  const [logoInfo, setLogoInfo] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/store/');
        const data = await res.json();
        if (data && data.length > 0) {
          const cloudinaryBaseURL = 'https://res.cloudinary.com/di0aqgf2u/';
          setLogoInfo(cloudinaryBaseURL + data[0].logo);
        }
      } catch (error) {
        console.error('Failed to fetch logo URL:', error);
      }
    };

    fetchLogo();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/menu?search=${searchTerm}`);
    }
  };

  return (
    <header className="header">
      <div className="grid">
        <nav className="navbar">
          <ul className="nav-list">
            <li className="nav-item">
              <Link className="nav-item-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-item-link" to="/menu">
                Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-item-link" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
          <ul className="nav-list">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-item-link" to="/account">
                    <FontAwesomeIcon icon={faUser} className="nav-item-icon" />
                    Account
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-item-link" onClick={onLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} className="nav-item-icon" />
                    Logout
                  </Link>
</li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-item-link" to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-item-link" to="/login">
                    Login
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <div className="header-with-search">
          <div className="header-logo">
            <img src={logoInfo} className="header-logo-img" alt="Logo" />
          </div>
          <div className="header-search">
            <div className="header-search-wrap">
              <input
                type="text"
                className="header-search-input"
                placeholder="Nhập để tìm kiếm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="header-search-btn" onClick={handleSearch}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="header-search-icon" />
            </button>
          </div>
          <div className="header-cart">
            <div className="header-cart-wrap">
               <Link className="nav-item-link" to="/cart">
                <FontAwesomeIcon icon={faCartShopping} className="header-cart-icon" />
               </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
