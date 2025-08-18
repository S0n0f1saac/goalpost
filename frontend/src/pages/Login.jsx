// frontend/src/pages/Login.jsx                     // simple login + me + logout UI
import { useState, useEffect } from "react";        // React hooks for state/effects
import { login, me, logout, getAccessToken } from "../lib/api.js"; // our API helpers

export default function Login() {                   // default export component
  const [username, setUsername] = useState("");     // username field state
  const [password, setPassword] = useState("");     // password field state
  const [user, setUser] = useState(null);           // current user info state
  const [msg, setMsg] = useState("");               // status/error message

  useEffect(() => {                                  // run once on mount
    if (getAccessToken()) {                          // if we already have a token
      me().then(setUser).catch(() => setUser(null)); // fetch /me and set user
    }
  }, []);                                            // empty deps → run once

  async function onSubmit(e) {                       // form submit handler
    e.preventDefault();                              // stop page reload
    setMsg("Signing in…");                           // show progress
    try {                                            // try/catch for errors
      await login(username, password);               // call token endpoint + store tokens
      const u = await me();                          // fetch current user via /me
      setUser(u);                                    // store user in state
      setMsg("Signed in");                           // success message
    } catch (err) {                                  // on failure
      setMsg(err.message || "Login failed");         // show error message
      setUser(null);                                 // clear user
    }
  }

  function onLogout() {                              // logout button handler
    logout();                                        // clear tokens from storage
    setUser(null);                                   // clear user state
    setMsg("Signed out");                            // update status
  }

  return (                                           // render UI
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}> {/* centered card */}
      <h1>GoalPost Login</h1>                        {/* title */}
      <form onSubmit={onSubmit}>                     {/* login form */}
        <label>Username</label>                      {/* username label */}
        <input                                       
          value={username}                           // controlled input value
          onChange={e => setUsername(e.target.value)}// update state on type
          placeholder="testuser"                     // hint text
          style={{ display: "block", width: "100%", marginBottom: 12 }} // basic styling
        />
        <label>Password</label>                      {/* password label */}
        <input
          type="password"                            // hide password characters
          value={password}                           // controlled input
          onChange={e => setPassword(e.target.value)}// update state
          placeholder="StrongPass123"                // hint text
          style={{ display: "block", width: "100%", marginBottom: 12 }} // basic styling
        />
        <button type="submit">Sign In</button>       {/* submit button */}
      </form>

      <p>{msg}</p>                                   {/* status/error message */}

      {user && (                                     // only show when logged in
        <div style={{ marginTop: 16 }}>              {/* container */}
          <strong>Current User</strong>              {/* header */}
          <pre>{JSON.stringify(user, null, 2)}</pre> {/* show id/username/email */}
          <button onClick={onLogout}>Logout</button> {/* logout button */}
        </div>
      )}
    </div>
  );
}
