import React from "react";
// import './Navbar.css'; // Optional if you need external CSS
import { Link } from "react-router-dom";
function Navbar() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom" style={{ height: "64px" }}>
        <Link className="navbar-brand d-flex align-items-center" to="/"> 
          {/* ✅ Use correct image path and size */}
          <img 
            src="/media/images/logo.svg" 
            alt="TradeX Logo" 
            style={{ height: "20px" }} 
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to ="/signup">Signup</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active"  aria-current="page" to ="/about">About</Link>
            </li>
            <li className="nav-item ">
              <Link className="nav-link active" aria-current="page" to ="/product">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to ="/pricing">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to ="/support">Support</Link>
            </li>
            <li className="nav-item">
              <span className="nav-link active">&#9776;</span>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
