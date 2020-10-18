import React, { useRef, useState, useContext } from "react";
import jwtDecode from "jwt-decode";

import "./styles.css";
import AuthContext from "context/auth-context";

export default function Auth() {
  /**
   * we can use state here which we should
   * but I want to try a different approach to
   * handle the input values i.e. ref
   */

  const emailRef = useRef();
  const passwordRef = useRef();

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const onSubmit = async e => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email.trim() || !password.trim()) return;

    console.log({ email, password });

    /**
     * we should use axios or similar kind of mudule to get the data
     * but I want to use fetch here for the simplicity or I guess I'm lazy enough
     * to type npm i axios/other_package :)
     */

    let payload = {
      query: `
        query {
          login(email:"${email}", password: "${password}") {
            token
          }
        }
      `,
    };

    if (!isLogin) {
      payload = {
        query: `
          mutation {
            createUser(userInput: {email:"${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      };
    }

    try {
      setIsLoading(true);
      let res = await fetch("http://localhost:5000/api/graphql/v1", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
      });

      res = await res.json();

      console.log({ res });

      const token = res.data.login.token;
      if (token) {
        const { _id, exp } = jwtDecode(token);

        dispatch({ type: "SET_AUTH_TOKEN", payload: { _id, exp, token } });
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log({ onSubmitError: error });
    }
  };

  const switchModeHandler = () => {
    setIsLogin(isLogin => !isLogin);
  };

  const submitButtonContent = () => {
    if (isLogin) {
      return isLoading ? "Loading..." : "Sign in";
    }
    return isLoading ? "Loading..." : "Sign  up";
  };

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <div className="form-control">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" ref={emailRef} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordRef} />
      </div>
      <div className="form-actions">
        {/* type="submit" triggers the form submit event */}
        <button type="submit">{submitButtonContent()}</button>
        {/* type="button" don't triggers the form submit event */}
        <button type="button" onClick={switchModeHandler} disabled={isLoading}>
          Switch to {isLogin ? "Signup" : "Sign in"}
        </button>
      </div>
    </form>
  );
}
