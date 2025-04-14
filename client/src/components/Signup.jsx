import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("resident");
    const [societyName, setSocietyName] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    // Function to validate email format
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const PostData = async () => {
        if (!name || !email || !phone || !password || !societyName || !address) {
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
                    phone,
                    password,
                    role,
                    societyName,
                    address,
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
        <div className="min-h-screen bg-gray-50 py-6 flex flex-col justify-center sm:py-12 ">
            <div className="relative py-3 sm:max-w-md sm:mx-auto w-full px-4">
                <div className="bg-white px-4 py-6 rounded-lg shadow-md sm:px-6">
                    <div className="text-center mb-4">
                        <h2 className="text-2xl font-bold text-indigo-600">Societyy</h2>
                        <p className="mt-1 text-sm text-gray-500">Create your account</p>
                    </div>
                    
                    <div className="space-y-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                type="number"
                                placeholder="1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        
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
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Society Name</label>
                            <input
                                type="text"
                                placeholder="Green Valley Society"
                                value={societyName}
                                onChange={(e) => setSocietyName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Society Address</label>
                            <input
                                type="text"
                                placeholder="123 Main St, City"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-white"
                            >
                                <option value="resident">Resident</option>
                                <option value="admin">Admin</option>
                                <option value="guard">Guard</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <button
                            className={`w-full bg-indigo-600 text-white py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                            type="button"
                            onClick={PostData}
                            disabled={loading}
                        >
                            {loading ? "Signing Up..." : "Create Account"}
                        </button>
                    </div>
                    
                    <div className="mt-4 text-center">
                        <Link to="/signin" className="text-xs text-indigo-600 hover:text-indigo-500 font-medium">
                            Already have an account? Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;