import { createContext, useContext, useState, useEffect } from "react";

export const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---- Load Admin Session from localStorage on page refresh ----
  useEffect(() => {
    const savedAdmin = localStorage.getItem("admin");
    const savedToken = localStorage.getItem("admin_token");

    if (savedAdmin && savedToken) {
      setAdmin(JSON.parse(savedAdmin));
      setToken(savedToken);
    }

    setLoading(false);
  }, []);

  // ---- Admin Login ----
  const adminLogin = (adminData, tokenValue) => {
    setAdmin(adminData);
    setToken(tokenValue);

    localStorage.setItem("admin", JSON.stringify(adminData));
    localStorage.setItem("admin_token", tokenValue);
  };

  // ---- Admin Logout ----
  const adminLogout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("admin_token");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        token,
        adminLogin,
        adminLogout,
        isAdminAuthenticated: !!admin,
      }}
    >
      {!loading && children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
