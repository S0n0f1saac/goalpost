// frontend/src/pages/Register.jsx                      // renders a simple register form
import { useState } from "react";                       // state hook for form fields
import { useNavigate } from "react-router-dom";         // redirect after signup
import { register as apiRegister, login } from "/src/lib/api.js"; // absolute import from /src

export default function Register() {                    // exported page component
  const [username, setUsername] = useState("");         // username text state
  const [email, setEmail] = useState("");               // email text state
  const [password, setPassword] = useState("");         // password text state
  const [msg, setMsg] = useState("");                   // status/error message
  const navigate = useNavigate();                       // router navigate helper

  async function onSubmit(e) {                          // submit handler
    e.preventDefault();                                 // prevent page reload
    setMsg("Creating account…");                        // show progress
    try {                                               // attempt signup + login
      await apiRegister({ username, email, password }); // call /auth/register/
      await login(username, password);                  // immediately log in
      setMsg("Account created — redirecting…");         // success msg
      navigate("/", { replace: true });                 // go to protected home
    } catch (err) {                                     // on failure
      setMsg(err?.message || "Registration failed");    // show error
    }
  }

  return (                                              // render minimal UI
    <div style={{ maxWidth: 420, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>Create Account</h1>
      <form onSubmit={onSubmit}>
        <label>Username</label>
        <input value={username} onChange={e=>setUsername(e.target.value)} style={{display:"block",width:"100%",marginBottom:12}} />
        <label>Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} style={{display:"block",width:"100%",marginBottom:12}} />
        <label>Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{display:"block",width:"100%",marginBottom:12}} />
        <button type="submit">Sign Up</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}

