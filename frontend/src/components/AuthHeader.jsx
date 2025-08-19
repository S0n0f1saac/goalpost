// frontend/src/components/AuthHeader.jsx                  // small header showing auth state
import { useEffect, useState } from "react";               // React hooks for state/effects
import { me, logout, getAccessToken } from "../lib/api.js";// our API helpers
import { useNavigate, Link } from "react-router-dom";      // router navigation + links

export default function AuthHeader() {                     // default export component
  const [user, setUser] = useState(null);                  // holds current user object or null
  const navigate = useNavigate();                          // lets us programmatically navigate

  useEffect(() => {                                        // run once on mount
    if (!getAccessToken()) return;                         // if no token, skip fetching /me
    me().then(setUser).catch(() => setUser(null));         // try to fetch /me; on error clear user
  }, []);                                                  // empty deps → run once

  function onLogout() {                                    // handler for logout click
    logout();                                              // clear tokens from storage
    setUser(null);                                         // clear user in state
    navigate("/login", { replace: true });                 // jump to login page
  }

  return (                                                 // render a very small top bar
    <div style={{                                         // inline styles to keep it simple
      display: "flex", justifyContent: "space-between", 
      padding: "10px 14px", borderBottom: "1px solid #eee"
    }}>
      <nav style={{ display: "flex", gap: 12 }}>          {/* simple nav links */}
        <Link to="/">Home</Link>                           {/* protected home */}
        <Link to="/login">Login</Link>                     {/* public login */}
        <Link to="/register">Register</Link>                {/* link to sign up */} 
      </nav>
      <div>                                               {/* right side user area */}
        {user ? (                                         // if logged in
          <>
            <span style={{ marginRight: 8 }}>             {/* show username */}
              {user.username}
            </span>
            <button onClick={onLogout}>Logout</button>    {/* logout button */}
          </>
        ) : (                                              // if logged out
          <span>Not signed in</span>                       // simple text
        )}
      </div>
    </div>
  );
}
