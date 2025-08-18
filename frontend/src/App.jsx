// src/App.jsx
// bring in router building blocks
import { BrowserRouter, Routes, Route } from "react-router-dom"; // top-level router + route table
// import pages
import Login from "./pages/Login.jsx";                            // public login page
import Home from "./pages/Home.jsx";                              // example protected page
// import the route guard
import ProtectedRoute from "./routes/ProtectedRoute.jsx";         // wraps private routes

export default function App() {                                   // root component rendered by main.jsx
  return (                                                        // return JSX to mount routing
    <BrowserRouter>                                               {/* watches URL and syncs UI */}
      <Routes>                                                    {/* route switch/controller */}
        <Route path="/login" element={<Login />} />               {/* public login route */}
        <Route element={<ProtectedRoute />}>                      {/* any routes inside are protected */}
          <Route path="/" element={<Home />} />                   {/* protected home at '/' */}
          {/* add more protected routes here (e.g., /feed, /profile, /teams, etc.) */}
        </Route>
        {/* you can add a catch-all 404 route if desired */}
        {/* <Route path="*" element={<div>Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}


