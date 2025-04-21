import { useState, useEffect, memo } from "react";
import axios from "axios";

// Lightweight animation utility without external dependencies
const FadeIn = memo(({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease'
      }}
    >
      {children}
    </div>
  );
});

// Memoized image card component to prevent unnecessary re-renders
const MediaCard = memo(({ file, isAdmin, onDelete, onOpen, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <FadeIn delay={index * 50}>
      <div 
        className="relative rounded-lg overflow-hidden shadow-md group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative aspect-square">
          <img
            src={file.url}
            alt="Media"
            loading="lazy" // Use native lazy loading
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onClick={() => onOpen(file)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        {isAdmin && isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file._id);
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg z-20"
            aria-label="Delete"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </FadeIn>
  );
});

const MediaGallery = ({ user }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const societyId = user?.societyId;
  const token = localStorage.getItem("token");
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!societyId) {
      console.error("societyId is missing!");
      return;
    }

    const controller = new AbortController();
    
    const fetchMedia = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/media/mediagallery/${societyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal
          }
        );

        console.log("Fetched media files:", response.data);
        setMediaFiles(response.data.media);
        setError(null);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error("Error fetching media:", err);
          setError("Failed to load media. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedia();
    
    // Clean up request on unmount
    return () => controller.abort();
  }, [societyId, token]);

  const handleDelete = async (id) => {
    if (!isAdmin) {
      alert("Only admins can delete media.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this media?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMediaFiles(prevFiles => prevFiles.filter(file => file._id !== id));
    } catch (err) {
      console.error("Error deleting media:", err);
      alert("Failed to delete media.");
    }
  };

  const openLightbox = (file) => {
    setSelectedImage(file);
    // Prevent body scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    // Restore body scrolling
    document.body.style.overflow = '';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Media Gallery</h2>
          <p className="text-blue-100 mt-1">Browse community photos and videos</p>
        </div>
        
        <div className="p-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {mediaFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mediaFiles.map((file, index) => (
                    <MediaCard
                      key={file._id}
                      file={file}
                      isAdmin={isAdmin}
                      onDelete={handleDelete}
                      onOpen={openLightbox}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-xl text-center border border-gray-100">
                  <div className="mb-4 w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">No Media Found</h3>
                  <p className="text-gray-500 mt-2">There are no photos or videos available for this society yet.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Lightweight Lightbox without heavy animations */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-screen">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute -top-10 right-0 bg-white/10 rounded-full p-2 text-white hover:bg-white/20 z-50"
              aria-label="Close lightbox"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img 
              src={selectedImage.url} 
              alt="Media Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(MediaGallery);