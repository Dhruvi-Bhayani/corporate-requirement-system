import React from "react";
import AuthPopup from "./AuthPopup";

export default function Login() {
  return (
    <AuthPopup 
      show={true}
      mode="login"
      onClose={() => {}}
    />
  );
}
