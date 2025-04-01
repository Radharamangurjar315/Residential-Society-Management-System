// import React, { useState } from "react";
// import axios from "axios";

// const MediaUpload = ({ societyId }) => {
//   const [file, setFile] = useState(null);

//   const handleFileChange = (event) => {
//     if (event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };
//   const handleUpload = async (event) => {
    
  
//     if (!file) {
//       console.error("No file selected!");
//       return;
//     }
  
//     const formData = new FormData();
//     formData.append("file", file);
  
//     try {
//       const response = await axios.post("http://localhost:5000/api/media/upload", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
  
//       console.log("File uploaded successfully:", response.data.url);
//     } catch (error) {
//       console.error("Upload error:", error.response ? error.response.data : error.message);
//     }
//   };
  

//   return (
//     <div>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={handleUpload}>Upload</button>
//     </div>
//   );
// };

// export default MediaUpload;
