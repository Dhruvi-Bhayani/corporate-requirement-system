import React, { useState } from "react";
import { Card, Container, Button } from "react-bootstrap";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import ToastMessage from "../../components/ToastMessage";
import "./VerifyOtp.css";

export default function VerifyOtp() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showToast, setShowToast] = useState(false); // ✅ Toast visibility
  
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (/^\d?$/.test(value)) {
      const newDigits = [...otpDigits];
      newDigits[index] = value;
      setOtpDigits(newDigits);

      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const otp = otpDigits.join("");

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });

      if (res.status === 200) {
        const successMsg = "OTP verified successfully!";
        setMessage(successMsg);

        // ✅ Show success toast
        setShowToast(true);

        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid OTP";
      setError(errMsg);

      // ❌ Show error toast
      setMessage(errMsg);
      setShowToast(true);
    }
  };

  return (
    <>
      {/* ✅ Toast message added */}
      <ToastMessage
        message={message}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <Container fluid className="verifyotp-bg d-flex justify-content-center align-items-center">
        <Card className="verifyotp-card p-4 shadow">
          <h3 className="text-center mb-3 verifyotp-title">Verify OTP</h3>

          {/* EMAIL INPUT */}
          <input
            type="email"
            className="form-control verifyotp-input mb-3"
            placeholder="Enter registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p className="verifyotp-label mb-1">Enter OTP</p>

          {/* OTP 6 BOXES */}
          <div className="d-flex justify-content-between mb-3">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                className="form-control text-center verifyotp-box"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
              />
            ))}
          </div>

          {error && <p className="text-danger text-center">{error}</p>}
          {message && <p className="text-success text-center">{message}</p>}

          <Button className="w-100 verifyotp-btn" onClick={handleVerify}>
            Verify OTP
          </Button>
        </Card>
      </Container>
    </>
  );
}
