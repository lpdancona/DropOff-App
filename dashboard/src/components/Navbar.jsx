import React from "react";
import { Link } from "react-router-dom";
import gbLogo from "../docs/gb-logo.svg";
export default function Navbar() {
  return (
    <header>
      <div className="container">
        <img src={gbLogo} alt="" className="gb-logo" />
        <Link to="/">
          <h1>ASP Drop Off</h1>
        </Link>
      </div>
    </header>
  );
}
