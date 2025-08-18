// frontend/src/App.jsx                                    // app root and route table
import { BrowserRouter, Routes, Route } from "react-router-dom"; // router primitives
import Login from "./pages/Login.jsx";                              // public login page
import Home from "./pages/Home.jsx";                                // example protected page
import ProtectedRoute from "./routes/ProtectedRoute.jsx";           // guard for private routes
import AuthHeader from "./components/AuthHeader.jsx";               // auth header 

export default function App() {                                     // root component
  return (                                                          // return JSX
    <BrowserRouter>                                                 {/* router provider */}
      <AuthHeader />                                                {/* top bar on all pages */}
      <Routes>                                                      {/* route definitions */}
        <Route path="/login" element={<Login />} />                 {/* public route */}
        <Route element={<ProtectedRoute />}>                        {/* protected wrapper */}
          <Route path="/" element={<Home />} />                     {/* protected home */}
           {/* add more protected routes here (e.g., /feed, /profile, /teams, etc.) */}
        </Route>
        {/* you can add a catch-all 404 route if desired */}
        {/* <Route path="*" element={<div>Not Found</div>} /> */}
      </Routes>
    </BrowserRouter>
  );
}


