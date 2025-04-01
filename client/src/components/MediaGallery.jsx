import React, { useState, useEffect } from "react";
import axios from "axios";

const MediaGallery = ({ user }) => {
    const [mediaFiles, setMediaFiles] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const societyId = user?.societyId;
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!societyId) {
            console.error("societyId is missing!");
            return;
        }

        const fetchMedia = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/media/mediagallery/${societyId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("Fetched media files:", response.data);
                setMediaFiles(response.data.media);
                setError(null);
            } catch (err) {
                console.error("Error fetching media:", err);
                setError("Failed to load media. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMedia();
    }, [societyId, token]);

    const handleDelete = async (id) => {
        if (!user || user.role !== "admin") {
            alert("Only admins can delete media.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this media?")) return;

        try {
            await axios.delete(`http://localhost:5000/api/media/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMediaFiles(mediaFiles.filter((file) => file._id !== id));
        } catch (err) {
            console.error("Error deleting media:", err);
            alert("Failed to delete media.");
        }
    };

    const openLightbox = (file) => {
        setSelectedImage(file);
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Media Gallery</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <>
                    {mediaFiles.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {mediaFiles.map((file) => (
                                <div key={file._id} className="group relative rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-48">
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity z-10"></div>
                                    <img
                                        src={file.url}
                                        alt="Media"
                                        className="w-full h-full object-cover cursor-pointer"
                                        onClick={() => openLightbox(file)}
                                    />
                                    {user?.role === "admin" && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(file._id);
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                            aria-label="Delete"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-600">No media found for this society.</p>
                        </div>
                    )}
                </>
            )}
            
            {/* Lightbox for Image Preview */}
            {selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeLightbox}>
                    <div className="relative max-w-4xl max-h-screen p-4">
                        <button 
                            onClick={closeLightbox}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 text-gray-800 hover:text-gray-600 z-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img 
                            src={selectedImage.url} 
                            alt="Media Preview" 
                            className="max-w-full max-h-[90vh] object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaGallery;