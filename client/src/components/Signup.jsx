import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import "./Auth.css";

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("resident"); // Default role is 'resident'
    const [societyName, setSocietyName] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to validate email format
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const PostData = async () => {
        if (!name || !email || !password || !societyName) {
            M.toast({ html: "All fields are required!", classes: "red darken-3" });
            return;
        }

        if (!validateEmail(email)) {
            M.toast({ html: "Invalid email format!", classes: "red darken-3" });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                    societyName,
                }),
            });

            const data = await res.json();
            setLoading(false);

            if (data.error) {
                M.toast({ html: data.error, classes: "red darken-3" });
            } else {
                M.toast({ html: data.message, classes: "green darken-1" });
                navigate("/signin");
            }
        } catch (error) {
            console.error("Error:", error.message);
            setLoading(false);
            M.toast({ html: "An error occurred. Please try again.", classes: "red darken-3" });
        }
    };

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Societyy</h2>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Society Name"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                />
                
                {/* Role Selection */}
                <div className="input-field">
                    <select
                        className="browser-default"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="resident">Resident</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    className={`btn waves-effect waves-light ${loading ? "disabled" : ""}`}
                    type="button"
                    onClick={PostData}
                >
                    {loading ? "Signing Up..." : "Signup"}
                </button>

                <h6>
                    <Link to="/signin">Already have an account? Sign in</Link>
                </h6>
            </div>
        </div>
    );
};

export default Signup;
