import React, { useReducer } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import Auth from "pages/Auth";
import Bookings from "pages/Bookings";
import Events from "pages/Events";
import MainNavigation from "components/Navigation/MainNavigation";
import AuthContext from "context/auth-context";
import { initialState, reducer } from "reducer/auth-reducer";
import { getLocalStorage } from "utils/local-storage";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const token = getLocalStorage()?.token;

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ state, dispatch }}>
        <MainNavigation />
        <main className="main-content">
          <Switch>
            {/**
             * Generally we have to make a protected component to check the
             * authentication. But for simplicity I have used the ternary operation here.
             */}

            {!token ? <Redirect exact from="/" to="/auth" /> : null}
            {token ? <Redirect exact from="/" to="/events" /> : null}
            {token ? <Redirect exact from="/auth" to="/events" /> : null}
            {!token ? <Route exact path="/auth" component={Auth} /> : null}
            <Route exact path="/events" component={Events} />
            {token ? (
              <Route exact path="/bookings" component={Bookings} />
            ) : (
              <Redirect to="/auth" />
            )}
          </Switch>
        </main>
      </AuthContext.Provider>
    </BrowserRouter>
  );
}

export default App;
