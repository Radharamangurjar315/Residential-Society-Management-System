import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./redux/authSlice"; // Ensure correct import path
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import "./Auth.css"; // Ensure correct path

const Signin = ({ setUser }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const PostData = async () => {
        if (!email || !password) {
            M.toast({ html: "Please enter all fields", classes: "red darken-3" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const text = await res.text(); // Get raw text response
            const data = text ? JSON.parse(text) : {}; // Parse if not empty
            setLoading(false);

            if (res.ok) {
                console.log("Login Successful:", data);

                if (!data.user) {
                    console.error("User object missing:", data);
                    M.toast({ html: "Unexpected server response", classes: "red darken-3" });
                    return;
                }

                // Store user and token in localStorage
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);

                dispatch(loginSuccess({ user: data.user, token: data.token }));
                setUser(data.user); // Sync state

                M.toast({ html: "Login Successful!", classes: "green darken-3" });

                // Redirect based on role
                navigate(data.user.role === "admin" ? "/admin" : "/home");
            } else {
                console.error("Login Failed:", data.message);
                M.toast({ html: data.message || "Invalid credentials", classes: "red darken-3" });
            }
        } catch (error) {
            setLoading(false);
            console.error("Login Error:", error);
            M.toast({ html: "Server Error! Try again later.", classes: "red darken-3" });
        }
    };

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Societyy</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button
                    className={`btn waves-effect waves-light ${loading ? "disabled" : ""}`}
                    onClick={PostData}
                    disabled={loading}
                >
                    {loading ? "Signing In..." : "Signin"}
                </button>
                <h6>
                    <Link to="/signup">Don't have an account? Signup</Link>
                </h6>
            </div>
        </div>
    );
};

export default Signin;
