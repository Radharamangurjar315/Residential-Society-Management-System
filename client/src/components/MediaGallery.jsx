import React, { useState, useEffect } from "react";
import axios from "axios";

const MediaGallery = ({ user }) => {
    const [mediaFiles, setMediaFiles] = useState([]); // Store only media array
    const [error, setError] = useState(null);

    const societyId = user?.societyId;
    const token = localStorage.getItem("token"); // Retrieve token

    useEffect(() => {
        if (!societyId) {
            console.error("societyId is missing!");
            return;
        }

        const fetchMedia = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/media/mediagallery/${societyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Fetched media files:", response.data);
                setMediaFiles(response.data.media); // Extract 'media' array
            } catch (err) {
                console.error("Error fetching media:", err);
                setError("Failed to load media. Please try again.");
            }
        };

        fetchMedia();
    }, [societyId, token]);

    const handleDelete = async (id) => {
      if (!user || user.role !== "admin") { // Check if user is admin
          alert("Only admins can delete media.");
          return;
      }

      if (!window.confirm("Are you sure you want to delete this media?")) return;

      try {
          await axios.delete(`http://localhost:5000/api/media/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
          });

          setMediaFiles(mediaFiles.filter((file) => file._id !== id)); // Remove deleted media from state
      } catch (err) {
          console.error("Error deleting media:", err);
          alert("Failed to delete media.");
      }
  };


    return (
        <div>
            <h2>Media Gallery</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {mediaFiles.length > 0 ? (
                    mediaFiles.map((file) => (
                        <div key={file._id} style={{ position: "relative", display: "inline-block", margin: "10px" }}>
                            <img 
                                src={file.url} 
                                alt="Media" 
                                width="300" 
                                style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "10px" }}
                            />
                             {/* Show delete button only for admins */}
                             {  (
                                <button
                                    onClick={() => handleDelete(file._id)}
                                    style={{
                                        position: "absolute",
                                        top: "5px",
                                        right: "5px",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "30px",
                                        height: "30px",
                                        cursor: "pointer",
                                      zIndex: 1000
            
                                    }}
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No media found for this society.</p>
                )}
            </div>
        </div>
    );
};

export default MediaGallery;
