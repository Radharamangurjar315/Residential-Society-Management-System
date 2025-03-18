import React, { useEffect, useState } from "react";
import "./Profile.css";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            let storedUser = JSON.parse(localStorage.getItem("user"));

            if (!storedUser) {
                try {
                    const token = localStorage.getItem("token");  // Get token for API
                    const response = await fetch("/getUser", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`,  // Pass token to get user data
                            "Content-Type": "application/json"
                        }
                    });

                    const data = await response.json();
                    if (data.user) {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        storedUser = data.user;
                        console.log("User data fetched successfully:", storedUser);
                    }
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }

            setUser(storedUser);
        };

        fetchUserData();
    }, []);

    if (!user) {
        return <h3>Loading user data...</h3>;
    }

    return (
        <div className="profile-card">
            <h2>Welcome, {user.name} 👋</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>  
            <button className="logout-btn" onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                window.location.reload();
            }}>
                Logout
            </button>
        </div>
    );
};

export default Profile;
