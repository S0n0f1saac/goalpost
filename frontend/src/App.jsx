// frontend/src/App.jsx                                         // app root and routes
import { BrowserRouter, Routes, Route } from "react-router-dom"; // router primitives
import Login from "./pages/Login.jsx";                            // public login page
import Home from "./pages/Home.jsx";                              // protected home page
import ProtectedRoute from "./routes/ProtectedRoute.jsx";         // guard wrapper for private routes
import AuthHeader from "./components/AuthHeader.jsx";             // top auth header
import Register from "./pages/Register.jsx";                      // public register page

export default function App() {                                   // export the root component
  return (                                                        // return JSX tree
    <BrowserRouter>                                               {/* provide routing context */}
      <AuthHeader />                                              {/* show header on all pages */}
      <Routes>                                                    {/* route table */}
        <Route path="/login" element={<Login />} />               {/* PUBLIC: /login */}
        <Route path="/register" element={<Register />} />         {/* PUBLIC: /register (ADD THIS) */}
        <Route element={<ProtectedRoute />}>                      {/* wrap protected routes */}
          <Route path="/" element={<Home />} />                   {/* PROTECTED: / */}
          {/* add more protected routes here (e.g., /feed, /profile, /teams, etc.) */}
        </Route>
        {/* you can add a catch-all 404 route if desired */}
        {/* <Route path="*" element={<div>Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );                                                              // end JSX
}



