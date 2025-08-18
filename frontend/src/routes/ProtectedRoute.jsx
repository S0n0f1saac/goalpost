// import required pieces from React Router
import { Navigate, Outlet } from "react-router-dom";  // Navigate redirects; Outlet renders nested routes
// import our token helpers
import { getAccessToken } from "../lib/api.js";       // reads access token from localStorage

export default function ProtectedRoute() {            // component that guards its child routes
  const authed = Boolean(getAccessToken());           // true if we currently have an access token
  return authed ? <Outlet /> : <Navigate to="/login" replace />; // show children or bounce to /login
}
