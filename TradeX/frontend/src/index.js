/**
 * ============================================================================
 * TradeX Landing Page Application Root (index.js)
 * ============================================================================
 * Purpose:
 *   Initializes and mounts the public-facing React landing website.
 *   - Uses `HashRouter` for routing across marketing pages (Home, Signup, About,
 *     Products, Pricing, Support, and 404 Fallback).
 *   - Wraps routes with persistent global `Navbar` and `Footer` components.
 * ============================================================================
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, Routes, Route } from "react-router-dom";
import "./index.css";

// Page Views
import HomePage from "./landing_page/home/HomePage";
import Signup from "./landing_page/signup/Signup";
import AboutPage from "./landing_page/about/AboutPage";
import ProductPage from "./landing_page/product/ProductsPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import SupportPage from "./landing_page/support/SupportPage";
import NotFound from "./landing_page/NotFound";

// Global Layout Components
import Navbar from "./landing_page/Navbar";
import Footer from "./landing_page/Footer";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    {/* Global Header Navigation Bar */}
    <Navbar />

    {/* Primary Routing Switcher */}
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/product" element={<ProductPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/support" element={<SupportPage />} />
      {/* 404 Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>

    {/* Global Footer Navigation & Legal Disclaimers */}
    <Footer />
  </HashRouter>
);
