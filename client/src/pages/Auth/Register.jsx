import React from "react";
import AuthPopup from "./AuthPopup";

export default function Register() {
  return (
    <AuthPopup 
      show={true}
      mode="signup"
      onClose={() => {}}
    />
  );
}
