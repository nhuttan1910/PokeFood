import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faBurger, faPhoneSquare } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import '../assets/main.css';
import '../assets/base.css';
import '../assets/home.css';

const List = () => {
  return (
    <div className="menu-list">
      <div className="menu-content">
        <div className="menu-item">
          <Link to="/" className="menu-text">
            <FontAwesomeIcon icon={faHouse} className="icon-home" />
            Home
          </Link>
        </div>
        <div className="line"></div>
        <div className="menu-item">
          <Link to="/menu" className="menu-text">
            <FontAwesomeIcon icon={faBurger} className="icon-home" />
            Menu
          </Link>
        </div>
        <div className="line"></div>
        <div className="menu-item">
          <Link to="/contact" className="menu-text">
            <FontAwesomeIcon icon={faPhoneSquare} className="icon-home" />
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
};

export default List;
