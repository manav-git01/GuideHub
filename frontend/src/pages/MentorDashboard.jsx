import React from 'react';
import './MentorDashboard.css';

const MentorDashboard = () => {
  return (
    <div className="mentor-dashboard">
      <h1>Mentor Dashboard</h1>
      <div className="dashboard-content">
        <section className="upcoming-sessions">
          <h2>Upcoming Sessions</h2>
          {/* Add upcoming sessions content */}
        </section>
        
        <section className="mentee-list">
          <h2>Your Mentees</h2>
          {/* Add mentee list content */}
        </section>
        
        <section className="session-history">
          <h2>Session History</h2>
          {/* Add session history content */}
        </section>
      </div>
    </div>
  );
};

export default MentorDashboard;
