import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (message, isError = false) => {
    // Using Materialize toast as in the original
    const classes = isError ? "red darken-3" : "green darken-3";
    M.toast({ html: message, classes });
  };

  const sendOtp = async () => {
    if (!email) {
      showToast("Please enter your email", true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setOtpSent(true);
        showToast(data.message || "OTP sent successfully");
      } else {
        showToast(data.error || "Failed to send OTP", true);
      }
    } catch (error) {
      setLoading(false);
      showToast("Server error while sending OTP", true);
    }
  };

  const resetPassword = async () => {
    if (!otp || !newPassword) {
      showToast("Please enter OTP and new password", true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        showToast(data.message || "Password reset successful");
        setTimeout(() => navigate("/signin"), 1500);
      } else {
        showToast(data.error || "Password reset failed", true);
      }
    } catch (error) {
      setLoading(false);
      showToast("Server error during reset", true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-md sm:mx-auto w-full px-4">
        <div className="bg-white px-4 py-6 rounded-lg shadow-md sm:px-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600">Societyy</h2>
            <p className="mt-1 text-sm text-gray-500">Reset your account password</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {!otpSent ? (
              <div className="mt-4">
                <button
                  className={`w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">One-Time Password</label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>

                <div className="mt-4">
                  <button
                    className={`w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    onClick={resetPassword}
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 flex flex-col items-center space-y-2">
            <Link 
              to="/signin" 
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;