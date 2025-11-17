import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 🔥 GLOBAL AUTH POPUP STATES
  const [showPopup, setShowPopup] = useState(false);
  const [authMode, setAuthMode] = useState("login"); // login | signup

  // Load user & token from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setAuthLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      setUser(user);
      setToken(token);

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data?.error || err.message);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        authLoading,

        // 🔥 POPUP CONTROLS
        showPopup,
        setShowPopup,
        authMode,
        setAuthMode,
      }}
    >
      {!authLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
