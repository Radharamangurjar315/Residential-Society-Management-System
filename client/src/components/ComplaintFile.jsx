import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Alert, Card, CardContent, Typography, CircularProgress } from "@mui/material";

const ComplaintFile = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

 
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const start = performance.now();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/complaints/file`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });
      const end = performance.now();
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFormData({ title: "", description: "" }); // Reset form
      setSuccess(true);
      setTimeout(() => {
        navigate('/admincomplaints');
      }, 1000); // Give a small delay to show success message
      
    } catch (error) {
    
      setError(error?.message || "Something went wrong while filing the complaint.");
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-2 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Reduced decorative elements */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-purple-100 to-blue-100 -z-10 opacity-50"></div>
        
        <Card 
          className="w-full rounded-lg overflow-hidden transition-all duration-300"
          sx={{ 
            boxShadow: '0 5px 20px -5px rgba(0, 0, 0, 0.1)',
            background: 'rgba(255, 255, 255, 0.98)',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '4px',
              background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            }
          }}
        >
          <CardContent className="p-4">
            <div className="flex flex-col items-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              
              <Typography 
                variant="h5" 
                className="text-center font-bold"
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #4f46e5, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                File a Complaint
              </Typography>
            </div>

            {error && (
              <Alert 
                severity="error" 
                className="mb-3 rounded-md"
                sx={{ 
                  alignItems: "center",
                  borderLeft: "3px solid #f43f5e",
                  background: "rgba(254, 226, 226, 0.6)",
                  color: "#9f1239",
                  padding: "4px 8px"
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                  {error}
                </Typography>
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                className="mb-3 rounded-md"
                sx={{ 
                  alignItems: "center",
                  borderLeft: "3px solid #10b981",
                  background: "rgba(209, 250, 229, 0.6)",
                  color: "#047857",
                  padding: "4px 8px"
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                  Complaint filed successfully!
                </Typography>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 ml-1">
                  Complaint Title
                </label>
                <TextField
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  fullWidth
                  placeholder="Brief title describing your issue"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      fontSize: "0.875rem"
                    }
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-700 ml-1">
                  Complaint Description
                </label>
                <TextField
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Provide details about your complaint"
                  variant="outlined"
                  size="small"
                  InputProps={{
                    sx: {
                      borderRadius: "8px",
                      backgroundColor: "#f9fafb",
                      fontSize: "0.875rem"
                    }
                  }}
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  size="medium"
                  sx={{
                    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                    padding: "8px 0",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textTransform: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <CircularProgress size={16} color="inherit" className="mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    "Submit Complaint"
                  )}
                </Button>
              </div>
            </form>
            
            <div className="mt-4 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-center space-x-3 text-xs">
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <Typography variant="caption">24h Response</Typography>
                </div>
                <div className="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <Typography variant="caption">Secure & Private</Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComplaintFile;