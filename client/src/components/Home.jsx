import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const shouldRefresh = localStorage.getItem("refreshHomeOnce");
    if (shouldRefresh === "true") {
      localStorage.setItem("refreshHomeOnce", "false"); // reset flag
      window.location.reload(); // 👈 silent refresh (not full page nav)
    }
  }, []);
  
  // Track mouse movement for the interactive hover effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 font-sans text-gray-800">
      {/* Interactive background bubbles */}
      <div className="absolute top-0 right-0 w-96 h-96 -mt-24 -mr-24 rounded-full bg-gradient-to-br from-indigo-200/20 to-pink-200/20 blur-3xl animate-float"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 -mb-12 -ml-12 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/20 blur-3xl animate-float-delay"></div>
      <div className="absolute top-1/3 left-1/12 w-48 h-48 rounded-full bg-gradient-to-br from-indigo-200/20 to-pink-200/20 blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 right-1/12 w-64 h-64 rounded-full bg-gradient-to-br from-purple-200/20 to-blue-200/20 blur-3xl animate-float-reverse"></div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          {/* Main heading with gradient text */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent animate-fade-in">
            Welcome to Our Community
          </h1>

          {/* Subtitle with multiple colors */}
          <div className="flex flex-wrap justify-center gap-3 mb-6 opacity-0 animate-fade-in-delay">
            <h3 className="text-xl md:text-2xl font-semibold text-purple-500 m-0">Making</h3>
            <h3 className="text-xl md:text-2xl font-semibold text-pink-500 m-0">Life</h3>
            <h3 className="text-xl md:text-2xl font-semibold text-blue-500 m-0">Better</h3>
            <h3 className="text-xl md:text-2xl font-semibold text-emerald-500 m-0">Together</h3>
          </div>

          {/* Description text */}
          <p className="max-w-2xl text-center text-base md:text-lg text-gray-700 leading-relaxed mb-8 opacity-0 animate-fade-in-delay-2">
            Experience the perfect blend of modern living and community spirit.
            Join us in creating a space where every resident feels at home.
          </p>

          {/* Navigation Cards at the top */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10 opacity-0 animate-fade-in-delay-3">
            {/* Explore Card */}
            <div 
              className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => navigate("/explore")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-4 group-hover:scale-110 transition duration-300">
                  <i className="fas fa-compass"></i>
                </div>
                <h4 className="text-lg font-bold">Explore</h4>
                <p className="text-xs mt-2 text-blue-100">Discover community features</p>
              </div>
            </div>

            {/* Polls Card */}
            <div 
              className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => navigate("/polls")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-4 group-hover:scale-110 transition duration-300">
                  <i className="fas fa-chart-bar"></i>
                </div>
                <h4 className="text-lg font-bold">Polls</h4>
                <p className="text-xs mt-2 text-green-100">Vote on community decisions</p>
              </div>
            </div>

            {/* Notices Card */}
            <div 
              className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => navigate("/notices")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-4 group-hover:scale-110 transition duration-300">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <h4 className="text-lg font-bold">Notices</h4>
                <p className="text-xs mt-2 text-amber-100">Important announcements</p>
              </div>
            </div>

            {/* Events Card */}
            <div 
              className="bg-gradient-to-br from-pink-500 to-rose-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => navigate("/events")}
            >
              <div className="flex flex-col items-center text-center">
                <div className="text-3xl mb-4 group-hover:scale-110 transition duration-300">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <h4 className="text-lg font-bold">Events</h4>
                <p className="text-xs mt-2 text-pink-100">Upcoming community activities</p>
              </div>
            </div>
          </div>

          {/* Call to action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md mx-auto opacity-0 animate-fade-in-delay-4">
            <button className="w-full py-3.5 px-6 rounded-full text-white font-medium bg-gradient-to-r from-indigo-500 to-indigo-600 hover:shadow-lg hover:from-indigo-600 hover:to-indigo-700 transform hover:-translate-y-0.5 transition duration-300 shadow-md shadow-indigo-500/30">
              Get Started
            </button>
            <button 
              className="w-full py-3.5 px-6 rounded-full font-medium text-indigo-600 border-2 border-indigo-500 hover:bg-indigo-50 transform hover:-translate-y-0.5 transition duration-300"
              onClick={() => navigate("/signin")}
            >
              Member Login
            </button>
          </div>

          {/* Featured content section */}
          <div className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-lg opacity-0 animate-fade-in-delay-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Featured Updates</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                <div className="text-xl text-indigo-500 mt-1">
                  <i className="fas fa-star"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Community Garden Opening</h3>
                  <p className="text-gray-600 text-sm">Join us for the grand opening of our community garden this weekend!</p>
                </div>
              </div>
              
              
              
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition duration-200">
                <div className="text-xl text-indigo-500 mt-1">
                  <i className="fas fa-users"></i>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Monthly Meeting</h3>
                  <p className="text-gray-600 text-sm">The next community meeting is scheduled for June 15th at 7 PM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive hover effect area */}
      <div className="fixed inset-0 pointer-events-none bg-indigo-500/5 opacity-0 hover:opacity-100 transition duration-300"></div>
    </div>
  );
};

export default HomePage;