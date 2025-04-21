import { useState, useEffect } from "react";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Pending");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [complaintsPerPage] = useState(9); // 3x3 grid on large screens

  // 🔹 Fetch user data from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || "resident"; // Default to resident
  const societyId = user?.societyId || "";

  useEffect(() => {
    if (token && societyId) {
      fetchComplaints();
    } else {
      setError("User not authenticated");
      setLoading(false);
    }
  }, []);

  // Reset to first page when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchComplaints = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/complaints/${societyId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Use token for authentication
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setComplaints(data.complaints);
      } else {
        setError("Failed to fetch complaints");
      }
    } catch (err) {
      setError("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateComplaintStatus = async (id, newStatus) => {
    try {
      if (newStatus === "Resolved") {
        // Locking complaint after it's resolved (no further updates allowed)
        const complaint = complaints.find((complaint) => complaint._id === id);
        if (complaint.status === "Resolved") {
          alert("This complaint is already resolved and locked!");
          return;
        }
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/complaints/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        setComplaints((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error("Error updating complaint:", err);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded shadow-md">
      <p className="font-medium">{error}</p>
      <p className="text-sm">Please try again or contact support.</p>
    </div>
  );

  // Function to handle the styling of status badges
  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border border-blue-300";
      case "Resolved":
        return "bg-green-100 text-green-800 border border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Get counts for tab badges
  const pendingCount = complaints.filter(c => c.status === "Pending").length;
  const inProgressCount = complaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = complaints.filter(c => c.status === "Resolved").length;

  // Get filtered complaints based on active tab
  const filteredComplaints = complaints.filter(complaint => complaint.status === activeTab);
  
  // Pagination logic
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);
  const totalPages = Math.ceil(filteredComplaints.length / complaintsPerPage);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of complaints section
    document.getElementById("complaints-section").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Complaints Dashboard</h2>
      
      {/* Tabs Navigation */}
      <div className="flex flex-wrap justify-center mb-6 border-b">
        {["Pending", "In Progress", "Resolved"].map((status) => (
          <button
            key={status}
            onClick={() => setActiveTab(status)}
            className={`px-6 py-3 font-medium text-sm rounded-t-lg transition duration-200 ease-in-out focus:outline-none 
              ${activeTab === status 
                ? "border-b-2 border-blue-500 text-blue-600" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
          >
            {status}
            <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full 
              ${activeTab === status ? getStatusClass(status) : "bg-gray-100 text-gray-600"}`}>
              {status === "Pending" ? pendingCount : 
               status === "In Progress" ? inProgressCount : resolvedCount}
            </span>
          </button>
        ))}
      </div>

      <div id="complaints-section">
        {/* No complaints message */}
        {filteredComplaints.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 className="mt-2 text-xl font-medium text-gray-900">No {activeTab} complaints</h3>
            <p className="mt-1 text-gray-500">There are no complaints with {activeTab.toLowerCase()} status.</p>
          </div>
        )}

        {/* Complaints grid */}
        {filteredComplaints.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentComplaints.map((complaint) => (
                <div 
                  key={complaint._id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">{complaint.title}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getStatusClass(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm line-clamp-3">{complaint.description}</p>
                    </div>
                    
                    {/* Divider */}
                    <div className="border-t border-gray-100 my-3"></div>
                    
                    {/* Only admins can update status and can't update resolved complaints */}
                    {userRole === "admin" && complaint.status !== "Resolved" && (
  <div className="mt-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Update Status:
    </label>
    <select
      className="block w-full bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      value={complaint.status}
      onChange={(e) => updateComplaintStatus(complaint._id, e.target.value)}
    >
      <option value="Pending">Pending</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
    </select>
  </div>
)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium 
                      ${currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium 
                        ${currentPage === i + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium 
                      ${currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            )}
            
            {/* Page indicator */}
            {totalPages > 1 && (
              <div className="text-center mt-4 text-sm text-gray-500">
                Showing {indexOfFirstComplaint + 1}-{Math.min(indexOfLastComplaint, filteredComplaints.length)} of {filteredComplaints.length} complaints
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Complaints;