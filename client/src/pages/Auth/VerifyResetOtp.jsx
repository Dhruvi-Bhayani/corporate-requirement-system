import React, { useState } from "react";
import { Card, Container, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ToastMessage from "../../components/ToastMessage";
import "./VerifyResetOtp.css";

export default function VerifyResetOtp() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false); // ⭐ toast flag

  const [params] = useSearchParams();
  const email = params.get("email");

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

  const handleVerify = async () => {
    setError("");
    setMessage("");

    const otp = otpDigits.join("");

    if (otp.length < 6) {
      const errMsg = "Enter a valid 6-digit OTP";
      setError(errMsg);
      setMessage(errMsg);
      setShowToast(true);
      return;
    }

    try {
      await api.post("/auth/verify-reset-otp", { email, otp });

      const successMsg = "OTP verified successfully!";
      setMessage(successMsg);
      setShowToast(true);

      setTimeout(() => {
        navigate("/reset-password?email=" + email);
      }, 1200);
    } catch (err) {
      const errMsg = err.response?.data?.error || "Invalid OTP";
      setError(errMsg);
      setMessage(errMsg);
      setShowToast(true);
    }
  };

  return (
    <>
      {/* ⭐ Toast Message */}
      <ToastMessage
        message={message}
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="otp-bg">
        <Container className="d-flex justify-content-center align-items-center otp-wrapper">
          <Card className="otp-card p-4">
            <h3 className="otp-title text-center mb-3">Verify OTP</h3>

            <div className="d-flex justify-content-between otp-box-wrapper">
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className="otp-input text-center"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                />
              ))}
            </div>

            {error && <p className="text-danger text-center mt-3">{error}</p>}
            {message && !error && (
              <p className="text-success text-center mt-3">{message}</p>
            )}

            <Button className="otp-btn w-100 mt-3" onClick={handleVerify}>
              Verify OTP
            </Button>
          </Card>
        </Container>
      </div>
    </>
  );
}
