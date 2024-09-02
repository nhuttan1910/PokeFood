import { React, useEffect, useState } from 'react';
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';


const Header = () => {
    const [logoInfo, setLogoInfo] = useState('');

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
          </ul>
        </nav>
        <div class="header-with-search">
                    <div class="header-logo">
                        <img src={logoInfo}  class="header-logo-img" />
                    </div>
                    <div class="header-search">
                        <div class="header-search-wrap">
                            <input type="text" class="header-search-input" placeholder="Nhập để tìm kiếm" />
                        </div>
                        <button class="header-search-btn">
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="header-search-icon" />
                        </button>
                    </div>
                    <div class="header-cart">
                        <div class="header-cart-wrap">
                            <FontAwesomeIcon icon={faCartShopping} className="header-cart-icon" />
                        </div>
                    </div>

                </div>
      </div>
    </header>
  );
};

export default Header;
