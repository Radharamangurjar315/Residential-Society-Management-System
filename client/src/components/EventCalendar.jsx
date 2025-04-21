import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, Clock, Plus, PlusCircle, Trash } from 'lucide-react';
import axios from 'axios';

const EventCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '', 
    date: '',
    location: '',
    societyId: ''
  });
  const [isDark, setIsDark] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user role from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
    }
  }, []);
  
  // Responsive design - check screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch events from backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      
      const user = JSON.parse(localStorage.getItem("user"));
      const societyId = user?.societyId;
      
      if (!societyId) {
        console.error("❌ Society ID is missing from localStorage.");
        setEvents([]);
        setError("No society ID found");
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/events?societyId=${societyId}`);
      

      // Ensure it's always an array and has the expected structure
      const fetchedEvents = Array.isArray(response.data) 
        ? response.data 
        : (response.data.data || []);
      setEvents(fetchedEvents);
      setError(null);
    } catch (err) {
      console.error("❌ Error fetching events:", err);
      setError(err.message || "Failed to fetch events");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  // Save events to local storage when they change
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  // Get days in current month
  const getDaysInMonth = useCallback((date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Get events for a specific date
  const getEventsForDate = useCallback((date) => {
    const formattedDate = date.toLocaleDateString('en-CA'); // Get local YYYY-MM-DD format
    return events.filter(event => {
      const eventDate = new Date(event.date).toLocaleDateString('en-CA');
      return eventDate === formattedDate;
    });
  }, [events]);

  // Add new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    const societyId = parsedUser?.societyId;
    
    if (!societyId) {
      alert("Society ID missing - please log in again");
      return;
    }
  
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      alert("Please fill all required fields");
      return;
    }
  
    try {
      const eventDateTime = new Date(`${newEvent.date}T${newEvent.time}:00Z`); // Append 'Z' to force UTC
      
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/events/add`,
        {
          title: newEvent.title,
          description: newEvent.description,
          date: eventDateTime.toISOString(),
          societyId,
          location: newEvent.location
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success && response.data.data) {
        setEvents((prevEvents) => [...prevEvents, response.data.data]);
      }
  
      setNewEvent({
        title: '',
        description: '',
        time: '',
        location: '',
        date: ''
      });
  
      setShowEventModal(false);
      fetchEvents();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert(`Failed: ${error.response?.data?.message || error.message}`);
    }
    setShowEventModal(false);
  };
  
  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    try {
        const token = localStorage.getItem("token"); // Ensure token is retrieved correctly
        const storedUser = localStorage.getItem("user");
        const parsedUser = JSON.parse(storedUser);

        const response = await fetch(`/api/events/${eventId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to delete event");
        }

       

        // 🔥 Immediately update UI by filtering out deleted event
        setEvents((prevEvents) => prevEvents.filter(event => event._id !== eventId));
        setShowEventModal(false); 

    } catch (error) {
        console.error("❌ Error deleting event:", error.message);
        setShowEventModal(false);
        alert("Only admin can delete events!!.");
        
    }
};
  // Handle date click to open event modal
  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setShowEventModal(true);
      setNewEvent(prev => ({
        ...prev,
        date: date.toLocaleDateString('en-CA') // Ensure local format YYYY-MM-DD
      }));
    }
  };

  // Open add event modal
  const openAddEventModal = () => {
    const today = new Date();
    const localDate = today.toLocaleDateString('en-CA');

    setSelectedDate(today);
    setNewEvent({
      title: '',
      description: '',
      time: '',
      location: '',
      date: localDate
    });
    setShowEventModal(true);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-2 sm:p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              ←
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <h2 className="text-lg font-semibold whitespace-nowrap">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <button 
              className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              →
            </button>
          </div>
          <button 
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
          <button
            onClick={openAddEventModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
          >
            <PlusCircle size={18} />
            Add Event
          </button>
          <select
            className="w-full sm:w-auto p-2 rounded border"
            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value)))}
            value={currentDate.getMonth()}
            aria-label="Select month"
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center p-4 text-blue-500">
            Loading events...
          </div>
        )}

        {error && (
          <div className="text-center p-4 text-red-500">
            Error: {error}
          </div>
        )}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
        {/* Day Names */}
        {isMobile 
          ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="p-1 sm:p-2 text-center font-bold bg-gray-100 text-xs sm:text-sm">
                {day}
              </div>
            ))
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
              <div key={index} className="p-1 sm:p-2 text-center font-bold bg-gray-100 text-xs sm:text-sm">
                {day}
              </div>
            ))
        }  
        
        {/* Calendar days */}
        {getDaysInMonth(currentDate).map((date, index) => (
          <div
            key={index}
            className={`min-h-[40px] sm:min-h-[50px] p-0.5 sm:p-1 border relative transition-all
              ${date && date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : 'bg-white'}
              ${isDark ? 'bg-gray-800 border-gray-700' : ''}
              ${date && hoveredDate === date.toDateString() ? 'bg-gray-50' : ''}
              ${date ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onMouseEnter={() => date && setHoveredDate(date.toDateString())}
            onMouseLeave={() => setHoveredDate(null)}
            onClick={() => date && handleDateClick(date)}
          >
            {date && (
              <>
                <div className="flex justify-between items-start">
                  <span className="text-xs sm:text-sm">{date.getDate()}</span>
                  {(getEventsForDate(date).length > 0) && (
                    <button
                      className={`p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white 
                        transition-colors ${hoveredDate === date.toDateString() ? 'opacity-100' : 'opacity-0'}`}
                      aria-label="Add event"
                    >
                      <Plus size={12} className="sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
                {getEventsForDate(date).length > 0 && (
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {getEventsForDate(date).map((event, idx) => (
                      (isMobile && idx > 0) ? (
                        idx === 1 && (
                          <div key="more-events" className="text-xs p-1 bg-gray-100 rounded text-center">
                            +{getEventsForDate(date).length - 1} more
                          </div>
                        )
                      ) : (
                        <div 
                          key={event._id}
                          className="text-xs p-1 bg-blue-100 rounded truncate hover:bg-blue-200 transition-colors group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate max-w-[80%]">{event.title}</span>
                            <Clock size={10} className="text-gray-500 sm:size-3" />
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-0 sm:p-4 z-50">
          <div className="w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-lg p-4 bg-white dark:bg-gray-800 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Add New Event'}
              </h3>
              <button 
                className="text-2xl hover:text-gray-600"
                onClick={() => setShowEventModal(false)}
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {selectedDate && getEventsForDate(selectedDate).length > 0 && (
              <div className="mb-4 space-y-2">
                <h4 className="font-medium">Existing Events:</h4>
                {getEventsForDate(selectedDate).map(event => (
                  <div key={event._id} className="p-3 border rounded-lg hover:bg-gray-50 group">
                    <div className="flex justify-between items-start">
                      <div className="font-semibold">{event.title}</div>
                      <button
                        onClick={() => handleDeleteEvent(event._id)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete event"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                    <div className="text-sm">{event.description}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock size={14} />
                      {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <form onSubmit={handleAddEvent} className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Event Title"
                className="w-full p-2 border rounded"
                value={newEvent.title}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  title: e.target.value,
                })}
                required
              />
              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                value={newEvent.description}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  description: e.target.value
                })}
              />
              <input
                type="text"
                placeholder="Event Location"
                className="w-full p-2 border rounded"
                value={newEvent.location}
                onChange={(e) => setNewEvent({
                  ...newEvent,
                  location: e.target.value,
                })}
                required
              />
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="date"
                  className="w-full sm:flex-1 p-2 border rounded"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    date: e.target.value
                  })}
                  required
                />
                <input
                  type="time"
                  className="w-full sm:flex-1 p-2 border rounded"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    time: e.target.value
                  })}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;