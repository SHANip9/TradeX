import React, { useState } from "react";

import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Orders", path: "/orders" },
    { label: "Holdings", path: "/holdings" },
    { label: "Positions", path: "/positions" },
    { label: "Funds", path: "/funds" },
    { label: "Apps", path: "/apps" },
  ];

  return (
    <div className="menu-container">
      <img src="logo.png" alt="Zerodha dashboard" style={{ width: "50px" }} />
      <div className="menus">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link style={{ textDecoration: "none" }} to={item.path}>
                <p
                  className={
                    location.pathname === item.path ? "menu selected" : "menu"
                  }
                >
                  {item.label}
                </p>
              </Link>
            </li>
          ))}
        </ul>
        <hr />
        <div
          className="profile"
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        >
          <div className="avatar">ZU</div>
          <p className="username">USERID</p>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown">
              <p>Equity: Rs. 4,043.10</p>
              <p>Account active</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
