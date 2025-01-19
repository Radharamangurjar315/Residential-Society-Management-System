import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css';
import './Auth.css';

const Signin = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        fetch('/signin', { // Updated the endpoint to '/signin'
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: password,
                email: email
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({ html: data.error });
            } else {
                M.toast({ html: "Signed in successfully" });
                
                // Handle role-based redirection based on data.role
                if (data.role === "admin") {
                    navigate('/admin-dashboard'); // Redirect to admin dashboard
                } else if (data.role === "resident") {
                    navigate('/resident-dashboard'); // Redirect to resident dashboard
                } else {
                    navigate('/'); // Default redirection
                }
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            M.toast({ html: 'An error occurred. Please try again.' });
        });
    }

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
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    type="button"
                    onClick={PostData}>
                    Signin
                </button>
                <h6>
                    <Link to="/Signup">Don't have an account?</Link>
                </h6>
            </div>
        </div>
    );
}

export default Signin;
