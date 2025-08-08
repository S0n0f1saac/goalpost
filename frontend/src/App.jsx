// src/App.jsx

import { useEffect, useState } from "react";            // import React hooks for state and lifecycle
import axios from "axios";                              // axios simplifies HTTP requests

function App() {
  const [status, setStatus] = useState(null);          // holds the API response status object
  const [error, setError] = useState(null);            // holds any error text if the request fails

  // Read the backend base URL from Vite env (defined in .env.local)
  // This lets us switch between dev/prod without changing code.
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // e.g. "http://127.0.0.1:8000"

  useEffect(() => {                                     // runs after the component mounts
    // Define an async function so we can use await
    const fetchHealth = async () => {
      try {                                             // try/catch to handle request errors
        const url = `${API_BASE_URL}/api/health/`;     // construct the full endpoint URL
        const res = await axios.get(url);              // perform GET request to Django health check
        setStatus(res.data);                           // store the JSON body (e.g. {status:"ok", service:"..."})
        setError(null);                                // clear any previous errors
      } catch (err) {                                  // if something goes wrong...
        setError(err.message);                         // save error message for display
        setStatus(null);                               // clear the status object
      }
    };

    fetchHealth();                                      // kick off the API call once on mount
  }, [API_BASE_URL]);                                   // re-run if API base URL changes (unlikely in dev)

  return (
    <div style={{                                      // inline styles just for quick scaffolding
      minHeight: "100vh",                              // make the app at least full viewport height
      display: "flex",                                 // use flexbox for centering
      alignItems: "center",                            // vertical center
      justifyContent: "center",                        // horizontal center
      fontFamily: "system-ui, Arial, sans-serif"       // simple readable font stack
    }}>
      <div>                                            {/* container for our content */}
        <h1>GoalPost — Frontend Smoke Test</h1>        {/* title for clarity */}
        <p>
          Backend URL: <code>{API_BASE_URL}</code>     {/* show which backend we’re hitting */}
        </p>

        {/* Conditional rendering based on request state */}
        {status && (                                   // if we have a status object from the API...
          <pre style={{ background: "#111", color: "#0f0", padding: 12 }}>
            {JSON.stringify(status, null, 2)}          {/* pretty-print the JSON */}
          </pre>
        )}

        {error && (                                    // if an error occurred...
          <pre style={{ background: "#300", color: "#fff", padding: 12 }}>
            Error: {error}                             {/* show the error message */}
          </pre>
        )}

        {!status && !error && (                        // if neither status nor error yet...
          <p>Loading health check…</p>                 // show a loading message
        )}
      </div>
    </div>
  );
}

export default App;                                    // export the component as default

