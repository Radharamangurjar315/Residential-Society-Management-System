import React, { useState, useCallback, useEffect } from 'react';
import { Calendar, Clock, Plus, PlusCircle, Trash } from 'lucide-react';
import axios from 'axios';

const EventCalendar = ({ isAdmin = false }) => {
  // ... [Previous state declarations remain the same] ...
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    time: '',
    date: '',
  });
  const [isDark, setIsDark] = useState(false);
  const [hoveredDate, setHoveredDate] = useState(null);

  // ... [Previous useEffect and helper functions remain the same] ...
  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);
  

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/events/add', newEvent)
      .then(res => {
        setEvents([...events, res.data]);
        setShowEventModal(false);
      })
      .catch(err => console.error(err));
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
        console.log('Event deleted successfully');
      } else {
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  
  const getEventsForDate = useCallback((date) => {
    return events.filter(event => event.date === date.toISOString().split('T')[0]);
  }, [events]);

  const handleDateClick = (date) => {
    if (date) {
      setSelectedDate(date);
      setShowEventModal(true);
      setNewEvent(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0]
      }));
    }
  };

  const openAddEventModal = () => {
    setSelectedDate(new Date());
    setNewEvent({
      title: '',
      description: '',
      time: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowEventModal(true);
  };

  return (
    <div className={`max-w-4xl mx-auto p-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white'}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button 
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={handlePrevMonth}
          >
            ←
          </button>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <button 
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={handleNextMonth}
          >
            →
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAddEventModal}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
          >
            <PlusCircle size={18} />
            Add Event
          </button>
          <select
            className="p-2 rounded border"
            onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value)))}
            value={currentDate.getMonth()}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>{month}</option>
            ))}
          </select>
          <button 
            className="p-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-colors"
            onClick={() => setIsDark(!isDark)}
          >
            Toggle Theme
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 border rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="p-2 text-center font-bold bg-gray-100 text-sm">
            {day}
          </div>
        ))}
        
        {getDaysInMonth(currentDate).map((date, index) => (
          <div
            key={index}
            className={`min-h-[80px] p-2 border relative transition-all
              ${date && date.toDateString() === new Date().toDateString() ? 'bg-blue-50' : 'bg-white'}
              ${isDark ? 'bg-gray-800 border-gray-700' : ''}
              ${date && hoveredDate === date.toDateString() ? 'bg-gray-50' : ''}
              ${date ? 'cursor-pointer hover:bg-gray-50' : ''}`}
            onMouseEnter={() => date && setHoveredDate(date.toDateString())}
            onMouseLeave={() => setHoveredDate(null)}
            onClick={() => handleDateClick(date)}
          >
            {date && (
              <>
                <div className="flex justify-between items-start">
                  <span>{date.getDate()}</span>
                  {(isAdmin || getEventsForDate(date).length > 0) && (
                    <button
                      className={`p-1 rounded-full bg-blue-500 hover:bg-blue-600 text-white 
                        transition-colors ${hoveredDate === date.toDateString() ? 'opacity-100' : 'opacity-0'}`}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
                {getEventsForDate(date).length > 0 && (
                  <div className="mt-1 space-y-1">
                    {getEventsForDate(date).map(event => (
                      <div 
                        key={event.id}
                        className="text-xs p-1 bg-blue-100 rounded truncate hover:bg-blue-200 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <span>{event.title}</span>
                          <Clock size={12} className="text-gray-500" />
                        </div>
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`w-full max-w-md rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {selectedDate ? `Events for ${selectedDate.toLocaleDateString()}` : 'Add New Event'}
              </h3>
              <button 
                className="text-2xl hover:text-gray-600"
                onClick={() => setShowEventModal(false)}
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
          >
            <Trash size={16} />
          </button>
        </div>
        <div className="text-sm">{event.description}</div>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Clock size={14} />
          {event.time}
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
              <div className="flex gap-2">
                <input
                  type="date"
                  className="flex-1 p-2 border rounded"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({
                    ...newEvent,
                    date: e.target.value
                  })}
                  required
                />
                <input
                  type="time"
                  className="flex-1 p-2 border rounded"
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