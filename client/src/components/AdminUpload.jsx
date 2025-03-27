import { useState, useEffect } from "react";
import axios from "axios";

const AdminUpload = ({ societyId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState("");

  // Fetch token from localStorage when component mounts
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setToken(userToken);
      console.log("Token found:", userToken);
    } else {
      console.error("No authentication token found!");
    }
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("societyId", societyId);

    try {
      const res = await axios.post("/api/media/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
          "Content-Type": "multipart/form-data",
        },
      });

      alert("File uploaded successfully!");
      console.log("Uploaded file:", res.data);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed! Please try again.");
    }
  };

  return (
    <div>
      <h2>Admin Upload Panel</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default AdminUpload;
