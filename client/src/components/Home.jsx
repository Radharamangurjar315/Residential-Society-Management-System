import React from 'react';
import './Home.css';
import EventCalendar from './EventCalendar';

const HomePage = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Welcome to Your Society Portal</h1>
        <p className="home-subtitle">Manage your society and stay connected effortlessly</p>
      </header>

      <main className="home-main">
        <div className="home-info-card">
          <h2 className="home-card-title">Explore Societies</h2>
          <p className="home-card-text">Browse all registered societies and manage apartments.</p>
          <button className="home-button">View Societies</button>
        </div>

        <div className="home-info-card">
          <h2 className="home-card-title">Apartment Details</h2>
          <p className="home-card-text">View and update apartment information seamlessly.</p>
          <button className="home-button">View Apartments</button>
        </div>
      </main>
<div>
        <div className="home-info-card">
          <h2 className="home-card-title">Manage Events</h2>
          <p className="home-card-text">Create and manage events for your society.</p>
          <button className="home-button">View Events</button>
        </div>  
        <EventCalendar/>
</div>
      <footer className="home-footer">
        <p className="home-footer-text">© 2024 Society Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
