import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignOutAlt} from "@fortawesome/free-solid-svg-icons";

const ManagerHeader = ({ onLogout }) => {
  return (
      <header className="header">

          <div className="grid">
              <nav className="navbar">
                  <ul className="nav-list">
                      <li className="nav-item">
                          <h1>Manager Panel</h1>
                      </li>
                      <li className="nav-item">
                          <Link className="nav-item-link" to="/manager/food-management" activeClassName="active">
                              Food Manager
                          </Link>
                      </li>
                      <li className="nav-item">
                          <Link className="nav-item-link" to="/manager/order-list" activeClassName="active">
                              Order List
                          </Link>
                      </li>

                  </ul>
                  <ul className="nav-list">
                      <li className="nav-item">
                          <Link className="nav-item-link" onClick={onLogout}>
                              <FontAwesomeIcon icon={faSignOutAlt} className="nav-item-icon"/>
                              Logout
                          </Link>
                      </li>
                  </ul>
              </nav>
          </div>

          {/*<nav>*/}
          {/*    <NavLink to="/manager/food-management" activeClassName="active">*/}
          {/*        Food Manager*/}
          {/*    </NavLink>*/}
          {/*    <NavLink to="/manager/order-list" activeClassName="active">*/}
          {/*        Order List*/}
          {/*    </NavLink>*/}
          {/*</nav>*/}
          {/*<button onClick={onLogout}>Logout</button>*/}

      </header>
  );
};

export default ManagerHeader;
