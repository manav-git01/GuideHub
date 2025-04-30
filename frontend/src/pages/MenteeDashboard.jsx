import React from 'react';
import './MenteeDashboard.css';

const MenteeDashboard = () => {
  return (
    <div className="mentee-dashboard">
      <h1>Mentee Dashboard</h1>
      <div className="dashboard-content">
        <section className="upcoming-sessions">
          <h2>Upcoming Sessions</h2>
          {/* Add upcoming sessions content */}
        </section>
        
        <section className="mentor-list">
          <h2>Your Mentors</h2>
          {/* Add mentor list content */}
        </section>
        
        <section className="progress">
          <h2>Your Progress</h2>
          {/* Add progress tracking content */}
        </section>
      </div>
    </div>
  );
};

export default MenteeDashboard; 