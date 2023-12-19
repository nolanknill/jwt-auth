import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  const handleLogin = (token) => {
    sessionStorage.setItem("token", token);
    setToken(token);
  }

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
  }

  if (!token) {
    return <Login handleLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard token={token} handleLogout={handleLogout}/> } />
          
          {/* <Route path="/posts" element={<Posts token={token} />} /> */}
          {/* <Route path="/profile/edit" element={<EditProfile token={token} />} /> */}
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
