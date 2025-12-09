import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { AdminAuthProvider } from "./admin/AdminAuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AdminAuthProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AdminAuthProvider>
  </BrowserRouter>
);
