/**
 * ============================================================================
 * Menu Navigation Component (Menu.js)
 * ============================================================================
 * Purpose:
 *   Renders the main navigation menu bar of the trading dashboard.
 *   - Links to Dashboard Summary, Analytics, Orders, Holdings, Positions, Funds, and Apps.
 *   - Highlights the currently active route based on `location.pathname`.
 *   - Contains a user avatar profile button with an interactive status dropdown.
 * ============================================================================
 */

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Menu = () => {
  // State to toggle the user profile dropdown popup
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const location = useLocation();

  // Navigation route configurations
  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Analytics", path: "/analytics" },
    { label: "Orders", path: "/orders" },
    { label: "Holdings", path: "/holdings" },
    { label: "Positions", path: "/positions" },
    { label: "Funds", path: "/funds" },
    { label: "Apps", path: "/apps" },
  ];

  return (
    <div className="menu-container">
      {/* TradeX Brand Logo */}
      <img src="TradeX.png" alt="TradeX dashboard" style={{ width: "90px" }} />
      
      <div className="menus">
        {/* Navigation Tab Links */}
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

        {/* User Profile Avatar with Interactive Dropdown */}
        <div
          className="profile"
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        >
          <div className="avatar">TX</div>
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
