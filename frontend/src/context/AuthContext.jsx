import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("photo_studio_token");
    const savedEmail = localStorage.getItem("photo_studio_email");
    const savedRole = localStorage.getItem("photo_studio_role");
    const loginTime = localStorage.getItem("photo_studio_login_time");

    if (savedToken && savedEmail) {
      // 3 hours in milliseconds: 3 * 60 * 60 * 1000 = 10800000 ms
      const maxAgeMs = 3 * 60 * 60 * 1000;
      const isExpired = loginTime && (Date.now() - parseInt(loginTime, 10) > maxAgeMs);

      if (isExpired) {
        localStorage.removeItem("photo_studio_token");
        localStorage.removeItem("photo_studio_email");
        localStorage.removeItem("photo_studio_login_time");
    localStorage.removeItem("photo_studio_role");
        setToken(null);
        setEmail(null);
        setRole(null);
      } else {
        setToken(savedToken);
        setEmail(savedEmail);
        setRole(savedRole || "admin");
      }
    }
  }, []);

  const login = (newToken, newEmail, newRole) => {
    localStorage.setItem("photo_studio_token", newToken);
    localStorage.setItem("photo_studio_email", newEmail);
    localStorage.setItem("photo_studio_login_time", Date.now().toString());
    localStorage.setItem("photo_studio_role", newRole || "admin");
    setToken(newToken);
    setEmail(newEmail);
    setRole(newRole || "admin");
  };

  const logout = () => {
    localStorage.removeItem("photo_studio_token");
    localStorage.removeItem("photo_studio_email");
    localStorage.removeItem("photo_studio_login_time");
    localStorage.removeItem("photo_studio_role");
    setToken(null);
    setEmail(null);
        setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
