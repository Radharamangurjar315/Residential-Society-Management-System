import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css';

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const PostData = () => {
        fetch('/Signup', {
            method: "post", // Ensure the method is POST
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                M.toast({ html: data.error });
            } else {
                M.toast({ html: data.message });
                navigate('/signin');
            }
        })
        .catch(error => {
            console.log('Error:', error.message);
            M.toast({ html: 'An error occurred. Please try again.' });
        });
    }

    return (
        <div className="mycard">
            <div className="card auth-card input-field">
                <h2>Societyy</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
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
                    onClick={PostData}
                >
                    Signup
                </button>
                <h6>
                    <Link to="/Signin">Already have an account?</Link>
                </h6>
            </div>
        </div>
    );
}

export default Signup;
