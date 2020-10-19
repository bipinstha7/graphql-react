import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";

import "./MainNavigation.css";
import AuthContext from "context/auth-context";
import { removeLocalStorage, getLocalStorage } from "utils/local-storage";

export default function MainNavigation() {
  const token = getLocalStorage()?.token;
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const onLogout = () => {
    removeLocalStorage();
    dispatch({ type: "ON_LOGOUT" });
    history.replace("/auth");
  };

  return (
    <header className="main-navigation">
      <div className="main-navigation__logo">
        <h1>Eventy </h1>
      </div>
      <nav className="main-navigation__items">
        <ul>
          bipinshrestha@gmail.com
          {!token ? (
            <li>
              <NavLink to="/auth">Authenticate</NavLink>
            </li>
          ) : null}
          <li>
            <NavLink to="/events">Events</NavLink>
          </li>
          {token ? (
            <>
              <li>
                <NavLink to="/bookings">Bookings</NavLink>
              </li>
              <li>
                <button onClick={onLogout}>Logout</button>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </header>
  );
}
