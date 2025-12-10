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

  // NEW ⭐ Reset popup (fix your issue)
  const resetAuthPopup = () => {
    setAuthMode("login");     // always go back to login form
    setShowPopup(false);      // close popup
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        "https://corporate-requirement-system-production.up.railway.app/api/auth/login",
        {
          email,
          password,
        }
      );

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

        // ⭐ NEW function
        resetAuthPopup,
      }}
    >
      {!authLoading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
