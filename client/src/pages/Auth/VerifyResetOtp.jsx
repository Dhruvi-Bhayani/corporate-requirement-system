import React, { useState } from "react";
import { Card, Container, Button } from "react-bootstrap";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function VerifyResetOtp() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    const otp = otpDigits.join("");

    if (otp.length < 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    try {
      const res = await api.post("/auth/verify-reset-otp", { email, otp });
      setMessage("OTP verified successfully!");

      setTimeout(() => {
        navigate("/reset-password?email=" + email);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Card className="p-4 shadow" style={{ width: "420px" }}>
        <h3 className="text-center mb-3">Verify OTP</h3>

        <div className="d-flex justify-content-between">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              className="form-control text-center"
              style={{ width: "45px", fontSize: "24px" }}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
            />
          ))}
        </div>

        {error && <p className="text-danger text-center mt-3">{error}</p>}
        {message && <p className="text-success text-center mt-3">{message}</p>}

        <Button className="w-100 mt-3" onClick={handleVerify}>
          Verify OTP
        </Button>
      </Card>
    </Container>
  );
}
