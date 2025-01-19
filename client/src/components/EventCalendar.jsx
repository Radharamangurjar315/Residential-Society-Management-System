import React, { useState, useEffect } from "react";
import "./EventCalendar.css"; // Import the CSS file

// Helper function to get the current month's calendar
const getCalendar = (year, month) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week (0-6)
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in the month
  const prevMonthDays = new Date(year, month, 0).getDate(); // Days in the previous month

  const calendar = [];
  let day = 1 - firstDayOfMonth; // Start from the previous month's last days

  for (let week = 0; week < 6; week++) {
    const weekRow = [];
    for (let weekday = 0; weekday < 7; weekday++) {
      if (day < 1) {
        // Previous month's days
        weekRow.push({ day: prevMonthDays + day, currentMonth: false });
      } else if (day > daysInMonth) {
        // Next month's days
        weekRow.push({ day: day - daysInMonth, currentMonth: false });
      } else {
        // Current month's days
        weekRow.push({ day, currentMonth: true });
      }
      day++;
    }
    calendar.push(weekRow);
    if (day > daysInMonth) break; // Stop after the last day of the month
  }

  return calendar;
};

export default function AdminEventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendar, setCalendar] = useState([]);
  const [events, setEvents] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventDescription, setEventDescription] = useState("");

  // Generate the calendar for the current month
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    setCalendar(getCalendar(year, month));
  }, [currentDate]);

  // Format a date to "YYYY-MM-DD"
  const formatDate = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  };

  // Handle adding or updating an event
  const handleAddEvent = () => {
    if (!selectedDate || !eventDescription.trim()) return;

    const newEvents = { ...events };
    if (!newEvents[selectedDate]) {
      newEvents[selectedDate] = [];
    }
    newEvents[selectedDate].push(eventDescription);
    setEvents(newEvents);
    setShowModal(false);
    setEventDescription("");
  };

  // Handle removing an event
  const handleRemoveEvent = (date, event) => {
    const newEvents = { ...events };
    newEvents[date] = newEvents[date].filter(e => e !== event);
    setEvents(newEvents);
  };

  // Move to the previous month
  const prevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(prev);
  };

  // Move to the next month
  const nextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(next);
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return (
    <div className="calendar-container">
      {/* Calendar Header */}
      <div className="calendar-header">
        <button onClick={prevMonth} className="nav-button">
          &lt;
        </button>
        <h2 className="month-label">
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth} className="nav-button">
          &gt;
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {/* Weekday Labels */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}

        {/* Calendar Dates */}
        {calendar.map((week, i) => (
          <div key={i} className="week-row">
            {week.map(({ day, currentMonth }, j) => {
              const formattedDate = formatDate(year, month, day);
              return (
                <div
                  key={j}
                  className={`date-cell ${currentMonth ? "" : "not-current-month"}`}
                  onClick={() => {
                    if (currentMonth) {
                      setSelectedDate(formattedDate);
                      setShowModal(true);
                    }
                  }}
                >
                  <span>{day}</span>
                  {/* Show event count if there are events */}
                  {events[formattedDate] && (
                    <div className="event-count">
                      {events[formattedDate].length} event(s)
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Event Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Event for {selectedDate}</h3>
            <textarea
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              placeholder="Enter event details..."
            />
            <button onClick={handleAddEvent}>Add Event</button>
            <button onClick={() => setShowModal(false)}>Close</button>

            {/* List of existing events for the selected date */}
            {events[selectedDate] && (
              <div className="event-list">
                <h4>Existing Events:</h4>
                <ul>
                  {events[selectedDate].map((event, index) => (
                    <li key={index} className="event-item">
                      {event}
                      <button
                        onClick={() => handleRemoveEvent(selectedDate, event)}
                        className="remove-event"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
