import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import gbLogo from "../docs/gb-logo.svg";
export default function Navbar() {
  return (
    <header>
      <div className="navbar-container">
        <div className="asp">
          <img src={gbLogo} alt="" className="gb-logo" />
          <Link to="/">
            <h1>ASP Drop Off</h1>
          </Link>
        </div>

        <div className="link-header-container">
          <Link to="/students">
            <h2>Students</h2>
          </Link>
        </div>
      </div>
    </header>
  );
}
