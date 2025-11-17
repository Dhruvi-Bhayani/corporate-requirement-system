import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, authLoading, setShowPopup, setAuthMode } = useAuth();

  if (authLoading) return null;

  // 🔥 Trigger popup AFTER render — not during
  useEffect(() => {
    if (!user) {
      setAuthMode("login");
      setShowPopup(true);
    }
  }, [user, setAuthMode, setShowPopup]);

  // 🔥 If not logged in, DO NOT render restricted page
  if (!user) return null;

  // 🔥 Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <p className="text-danger text-center mt-4">Access Denied</p>;
  }

  return children;
}
