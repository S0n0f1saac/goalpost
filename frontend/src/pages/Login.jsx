// frontend/src/pages/Login.jsx                               // login page

import { useState, useEffect } from "react";                  // React hooks
import { useNavigate } from "react-router-dom";               // router navigation
import {                                                     // API helpers
  login,                                                     // → POST /auth/token/
  me,                                                        // → GET /auth/me/
  logout,                                                    // → clear tokens
  getAccessToken,                                            // → read access token
} from "/src/lib/api.js";                                    // absolute import for Vite

import Input from "/src/components/ui/Input.jsx";            // UI: Input
import Card from "/src/components/ui/Card.jsx";              // UI: Card
import Button from "/src/components/ui/Button.jsx";          // UI: Button

export default function Login() {                            // component export
  const navigate = useNavigate();                            // navigate after login

  const [username, setUsername] = useState("");              // username state
  const [password, setPassword] = useState("");              // password state
  const [user, setUser] = useState(null);                    // current user state
  const [msg, setMsg] = useState("");                        // status text

  useEffect(() => {                                          // on mount
    if (!getAccessToken()) return;                           // skip if no token
    me()                                                     // fetch /me
      .then(setUser)                                         // store user
      .catch(() => setUser(null));                           // clear on error
  }, []);                                                    // run once

  async function onSubmit(e) {                               // submit handler
    e.preventDefault();                                      // stop page reload
    setMsg("Signing in…");                                   // show progress
    try {                                                    // try the flow
      await login(username, password);                       // get tokens
      const u = await me();                                  // fetch user
      setUser(u);                                            // store user
      setMsg("Signed in");                                   // success msg
      navigate("/", { replace: true });                      // go home
    } catch (err) {                                          // on failure
      setMsg(err?.message || "Login failed");                // show error
      setUser(null);                                         // clear user
    }
  }

  function onLogout() {                                      // logout handler
    logout();                                                // clear tokens
    setUser(null);                                           // clear user
    setMsg("Signed out");                                    // status
    navigate("/login", { replace: true });                   // back to login
  }

  return (                                                   // render
    <Card className="max-w-md mx-auto mt-10">               {/* centered card */}
      <h1 className="text-xl font-semibold mb-4">           {/* title */}
        GoalPost Login
      </h1>

      <form onSubmit={onSubmit}>                            {/* form wrapper */}
        {/* username input */}
        <Input
          label="Username"                                   // label text
          value={username}                                   // controlled value
          onChange={(e) => setUsername(e.target.value)}      // update state
          placeholder="testuser"                             // placeholder
          autoComplete="username"                            // browser autocomplete
        />

        {/* password input */}
        <Input
          label="Password"                                   // label text
          type="password"                                    // password field
          value={password}                                   // controlled value
          onChange={(e) => setPassword(e.target.value)}      // update state
          placeholder="••••••••"                              // placeholder
          autoComplete="current-password"                    // browser autocomplete
        />

        <div className="mt-2">                               {/* spacing */}
          <Button type="submit">Sign In</Button>             {/* submit */}
        </div>
      </form>

      <p className="mt-3 text-sm text-muted">                {/* status line */}
        {msg}
      </p>

      {user && (                                             // show only when logged in
        <div className="mt-4 space-y-2">                     {/* container */}
          <strong>Current User</strong>                      {/* header */}
          <pre className="text-sm bg-surface p-3 rounded-2xl shadow-card overflow-auto">
            {JSON.stringify(user, null, 2)}                  {/* id/username/email */}
          </pre>
          <Button variant="outline" onClick={onLogout}>      {/* logout */}
            Logout
          </Button>
        </div>
      )}
    </Card>
  );
}
