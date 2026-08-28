/**
 * ============================================================================
 * Landing Page Global Footer (Footer.js)
 * ============================================================================
 * Purpose:
 *   Standard footer across all public TradeX pages.
 *   - Categorized links (Company, Support, Account).
 *   - Legal notices, regulatory compliance information (SEBI, NSE, BSE), and risk disclosures.
 * ============================================================================
 */

import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container border-top mt-5">
        <div className="row mt-5">
          {/* Brand & Copyright */}
          <div className="col">
            <img src="/media/images/TradeX.png" style={{ width: "50%" }} alt="TradeX Logo" />
            <p>&copy; 2010-2026, Not TradeX Broking Ltd. All rights reserved.</p>
          </div>

          {/* Company Links */}
          <div className="col">
            <p>Company</p>
            <Link to="/about" className="text-muted text-decoration-none">About</Link><br />
            <Link to="/product" className="text-muted text-decoration-none">Products</Link><br />
            <Link to="/pricing" className="text-muted text-decoration-none">Pricing</Link><br />
            <a href="#referral" className="text-muted text-decoration-none">Referral programme</a><br />
            <a href="#careers" className="text-muted text-decoration-none">Careers</a><br />
            <a href="#press" className="text-muted text-decoration-none">Press &amp; media</a>
          </div>

          {/* Support Links */}
          <div className="col">
            <p>Support</p>
            <Link to="/support" className="text-muted text-decoration-none">Contact</Link><br />
            <Link to="/support" className="text-muted text-decoration-none">Support portal</Link><br />
            <a href="#blog" className="text-muted text-decoration-none">TradeX Blog</a><br />
            <a href="#charges" className="text-muted text-decoration-none">List of charges</a><br />
            <a href="#downloads" className="text-muted text-decoration-none">Downloads &amp; resources</a>
          </div>

          {/* Account Links */}
          <div className="col">
            <p>Account</p>
            <Link to="/signup" className="text-muted text-decoration-none">Open an account</Link><br />
            <a href="#fund-transfer" className="text-muted text-decoration-none">Fund transfer</a><br />
            <a href="#challenge" className="text-muted text-decoration-none">60 day challenge</a>
          </div>
        </div>

        {/* Regulatory & Legal Risk Disclaimers */}
        <div className="footer-legal">
          <p>
            TradeX Broking Ltd.: Member of NSE &amp; BSE. This clone is for
            learning/demo use and uses static content and local demo flows.
          </p>
          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing. Do not share
            tips, and do not authorize anyone to trade on your behalf.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
