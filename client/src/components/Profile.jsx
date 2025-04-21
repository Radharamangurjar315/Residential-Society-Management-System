import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        let storedUser = JSON.parse(localStorage.getItem("user"));
      
        if (!storedUser) {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Authentication token not found");
          }
          
          const response = await fetch(`${process.env.REACT_APP_API_URL}/getUser`, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            storedUser = data.user;
          } else {
            throw new Error("User data not available");
          }
        }

        setUser(storedUser);
      } catch (error) {
        console.error("Error fetching user:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="error-container">
        <h3>User data not available</h3>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  // More compact animation settings
  const containerAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };
  
  const itemAnimation = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="profile-container"
      {...containerAnimation}
    >
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="welcome-text"
          >
            Welcome, {user.name} 👋
          </motion.h2>
        </div>
        
        <div className="profile-details">
          <motion.div 
            className="detail-item"
            {...itemAnimation}
            transition={{ delay: 0.2 }}
          >
            <span className="detail-label">Email</span>
            <span className="detail-value">{user.email}</span>
          </motion.div>
          
          <motion.div 
            className="detail-item"
            {...itemAnimation}
            transition={{ delay: 0.25 }}
          >
            <span className="detail-label">Role</span>
            <span className="detail-value">
              <span className="role-badge">{user.role}</span>
            </span>
          </motion.div>
          
          <motion.div 
            className="detail-item"
            {...itemAnimation}
            transition={{ delay: 0.3 }}
          >
            <span className="detail-label">Society</span>
            <span className="detail-value">{user.societyName}</span>
          </motion.div>
          
          <motion.div 
            className="detail-item"
            {...itemAnimation}
            transition={{ delay: 0.35 }}
          >
            <span className="detail-label">Flat Number</span>
            <span className="detail-value">{user.flatNumber}</span>
          </motion.div>
          
          <motion.div 
            className="detail-item"
            {...itemAnimation}
            transition={{ delay: 0.4 }}
          >
            <span className="detail-label">Phone</span>
            <span className="detail-value">{user.phone}</span>
          </motion.div>
        </div>
        
        <motion.div
          className="button-container"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </span>
            Logout
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;