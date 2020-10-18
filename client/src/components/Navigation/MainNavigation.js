import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./MainNavigation.css";
import AuthContext from "context/auth-context";

export default function MainNavigation() {
  const { state } = useContext(AuthContext);

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Eventy </h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          bipinshrestha@gmail.com
          {state.token ? (
            <li>
              <NavLink to="/bookings">Bookings</NavLink>
            </li>
          ) : (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          )}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
