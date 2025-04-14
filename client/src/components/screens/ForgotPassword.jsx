import React, { useState } from "react";
import M from "materialize-css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      M.toast({ html: "Please enter your email", classes: "red darken-2" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setOtpSent(true);
        M.toast({ html: data.message || "OTP sent successfully", classes: "green darken-2" });
      } else {
        M.toast({ html: data.error || "Failed to send OTP", classes: "red darken-2" });
      }
    } catch (error) {
      setLoading(false);
      M.toast({ html: "Server error while sending OTP", classes: "red darken-2" });
    }
  };

  const resetPassword = async () => {
    if (!otp || !newPassword) {
      M.toast({ html: "Please enter OTP and new password", classes: "red darken-2" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        M.toast({ html: data.message || "Password reset successful", classes: "green darken-2" });
        navigate("/signin");
      } else {
        M.toast({ html: data.error || "Password reset failed", classes: "red darken-2" });
      }
    } catch (error) {
      setLoading(false);
      M.toast({ html: "Server error during reset", classes: "red darken-2" });
    }
  };

  return (
    <div className="mycard">
      <div
        className="card auth-card input-field"
        style={{ maxWidth: 400, margin: "50px auto", padding: 20, borderRadius: 12 }}
      >
        <h4 className="center-align">Forgot Password</h4>
        <p className="center grey-text">Reset your account password</p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={otpSent}
        />

        {!otpSent && (
          <button
            className={`btn waves-effect waves-light ${loading ? "disabled" : ""}`}
            onClick={sendOtp}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send OTP"}
          </button>
        )}

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className={`btn green waves-effect waves-light ${loading ? "disabled" : ""}`}
              onClick={resetPassword}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <div className="center" style={{ marginTop: 20 }}>
          <a href="/signin" className="blue-text text-darken-2">Back to Sign In</a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
