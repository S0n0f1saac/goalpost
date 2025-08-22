// frontend/src/App.jsx                                         // app root and routes
import { BrowserRouter, Routes, Route } from "react-router-dom"; // router primitives
import Login from "./pages/Login.jsx";                            // public login page
import Home from "./pages/Home.jsx";                              // protected home page
import ProtectedRoute from "./routes/ProtectedRoute.jsx";         // guard wrapper for private routes
import AuthHeader from "./components/AuthHeader.jsx";             // top auth header
import Register from "./pages/Register.jsx";                      // public register page
import Profile from "./pages/Profile.jsx";                        // profile page
import Matches from "./pages/Matches.jsx";                               // matches page
import Teams from "./pages/Teams.jsx";                                   // teams page
import BottomNav from "./components/BottomNav.jsx";                      // mobile bottom nav
import Feed from "./pages/Feed.jsx"; 

export default function App() {                                   // export the root component
  return (                                                        // return JSX tree
    <BrowserRouter>                                               {/* provide routing context */}
    <div className="pb-[72px]">
      <AuthHeader />                                              {/* show header on all pages */}
      <Routes>                                                    {/* route table */}
        <Route path="/login" element={<Login />} />               {/* PUBLIC: /login */}
        <Route path="/register" element={<Register />} />         {/* PUBLIC: /register (ADD THIS) */}
        <Route element={<ProtectedRoute />}>                      {/* wrap protected routes */}
          <Route path="/" element={<Home />} />                   {/* PROTECTED: / */}
          <Route path ="/profile" element={<Profile />} /> 
          <Route path="/feed" element={<Feed />} /> 
          <Route path="/matches" element={<Matches />} />           {/* matches */}
          <Route path="/teams" element={<Teams />} />               {/* teams */}
          {/* add more protected routes here (e.g., /feed, /profile, /teams, etc.) */}
        </Route>
        {/* you can add a catch-all 404 route if desired */}
        {/* <Route path="*" element={<div>Not Found</div>} /> */}
      </Routes>
      </div>
      <BottomNav />                                     {/* sticky tabs (mobile) */}
    </BrowserRouter>
  );                                                              // end JSX
}




