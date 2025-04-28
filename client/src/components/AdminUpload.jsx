import { useState, useEffect } from "react";
import axios from "axios";

const AdminUpload = ({ societyId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [token, setToken] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  // Fetch token from localStorage when component mounts
  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      setToken(userToken);
    } else {
      alert("No token found. Please log in again.");
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file");
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("societyId", societyId);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token
          "Content-Type": "multipart/form-data",
        },
      });

      setIsUploading(false);
      setSelectedFile(null);
      setFileName("");
      alert("File uploaded successfully!");
    } catch (err) {
      setIsUploading(false);
      alert("Upload failed! Please try again.");
    }
  };

  return (
   <>
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
     
      <><h2 className="text-2xl font-bold text-gray-800 mb-6">Media Upload</h2><div className="mb-6">
              <div className="flex items-center justify-center w-full">
                <label
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange} />
                </label>
              </div>

              {fileName && (
                <div className="mt-3 p-2 bg-gray-100 rounded-md flex items-center justify-between">
                  <span className="text-sm text-gray-700 truncate max-w-xs">{fileName}</span>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setFileName("");
                    } }
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              )}
            </div><div className="flex justify-end">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className={`px-4 py-2 rounded-md text-white font-medium ${!selectedFile || isUploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 transition-colors"}`}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </div>
                  ) : (
                    "Upload File"
                  )}
                </button>
              </div></>
      
    </div>
    </> 
  );

};
 

export default AdminUpload;