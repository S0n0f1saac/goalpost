// frontend/src/components/AuthHeader.jsx                            // path + purpose: top navigation with auth state
import { useEffect, useState } from "react";                         // React hooks for state/effects
import { Link, useNavigate } from "react-router-dom";                // router links + navigation hook
import { me, logout, getAccessToken } from "/src/lib/api.js";        // API helpers for auth state
import ThemeToggle from "/src/components/ui/ThemeToggle.jsx";           // theme toggle (light/dark)

export default function AuthHeader() {                               // DEFAULT export so `import AuthHeader ...` works
  const [user, setUser] = useState(null);                            // current user object (or null if logged out)
  const navigate = useNavigate();                                    // programmatic navigation after logout

  useEffect(() => {                                                  // run once on mount to hydrate user (if token exists)
    if (!getAccessToken()) return;                                   // if no token, skip fetching /me
    me().then(setUser).catch(() => setUser(null));                   // try to load user; clear on failure
  }, []);                                                            // empty deps → run once

  function onLogout() {                                              // logout click handler
    logout();                                                        // clear tokens in localStorage
    setUser(null);                                                   // clear local user state
    navigate("/login", { replace: true });                           // redirect to login page
  }                                                                  // end onLogout

  return (                                                           // render the header bar
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
      {/* left: simple nav links */}
      <nav className="flex flex-wrap gap-3">                         {/* left: simple nav links */}
        <Link to="/" className="hover:underline">Home</Link>         {/* link to protected home */}
        <Link to="/profile" className="hover:underline">Profile</Link> {/* link to profile page */}
        <Link to="/login" className="hover:underline">Login</Link>   {/* link to login page */}
        <Link to="/register" className="hover:underline">Register</Link> {/* link to register page */}
        <Link to="/feed" className="hover:underline">Feed</Link>     {/* link to global/my feed */}
        <Link to="/matches" className="hover:underline">Matches</Link> {/* optional: matches stub */}
        <Link to="/teams" className="hover:underline">Teams</Link>   {/* optional: teams stub */}
      </nav>                                                          {/* end nav */}

      {/* right: theme toggle + auth state */}
      <div className="flex items-center gap-3">                      {/* right: auth state */}
        <ThemeToggle />                                              {/* temporary theme toggle button */}
        {user ? (                                                    // if logged in
          <span className="flex items-center gap-2">                 {/* username + logout button */}
            <span>@{user.username}</span>                            {/* show username */}
            <button onClick={onLogout} className="text-sm underline">Logout</button> {/* logout */}
          </span>
        ) : (                                                        // if logged out
          <span className="text-sm text-muted">Not signed in</span>  /* simple text */
        )}
      </div>                                                         {/* end right side */}
    </div>                                                           // end bar container
  );                                                                 // end render
}                                                                    // end component

                                                                   



