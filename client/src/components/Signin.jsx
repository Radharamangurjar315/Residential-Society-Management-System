import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

const Signin = ({ setUser }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!email) {
      M.toast({ html: "Please enter your email", classes: "red darken-3" });
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
        setIsOtpSent(true);
        M.toast({ html: data.message || "OTP sent!", classes: "green darken-3" });
      } else {
        M.toast({ html: data.error || "Failed to send OTP", classes: "red darken-3" });
      }
    } catch (err) {
      setLoading(false);
      M.toast({ html: "Server error", classes: "red darken-3" });
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setIsOtpVerified(true);
        setStep(2);
        M.toast({ html: "OTP Verified!", classes: "green darken-3" });
      } else {
        M.toast({ html: data.error || "Invalid OTP", classes: "red darken-3" });
      }
    } catch (err) {
      setLoading(false);
      M.toast({ html: "Server error", classes: "red darken-3" });
    }
  };

  const login = async () => {
    if (!password) {
      M.toast({ html: "Enter your password", classes: "red darken-3" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        setUser(data.user);
        M.toast({ html: "Login Successful!", classes: "green darken-3" });
        navigate(data.user.role === "admin" ? "/admin" : "/home");
      } else {
        M.toast({ html: data.error || "Invalid credentials", classes: "red darken-3" });
      }
    } catch (err) {
      setLoading(false);
      M.toast({ html: "Server error", classes: "red darken-3" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-md sm:mx-auto w-full px-4">
        <div className="bg-white px-4 py-6 rounded-lg shadow-md sm:px-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-indigo-600">Societyy</h2>
            <p className="mt-1 text-sm text-gray-500">Sign in to your account</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step > 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {step === 1 && (
              <>
                {!isOtpSent ? (
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

                    <div className="mt-4">
                      <button
                        className={`w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                        onClick={verifyOtp}
                        disabled={loading}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            {step === 2 && isOtpVerified && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                  />
                </div>

                <div className="mt-4">
                  <button
                    className={`w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                    onClick={login}
                    disabled={loading}
                  >
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="mt-6 flex flex-col items-center space-y-2">
            <Link 
              to="/forgot-password" 
              className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Forgot your password?
            </Link>
            <Link 
              to="/signup" 
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;