import React, { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';

const CalendlyScheduler = ({ mentorId }) => {
  const [events, setEvents] = useState([]);
  const [schedulingLink, setSchedulingLink] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [selectedEventType, setSelectedEventType] = useState('');

  useEffect(() => {
    // Fetch event types
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(`/calendly/event-types/${mentorId}`);
        setEventTypes(response.data);
        if (response.data.length > 0) {
          setSelectedEventType(response.data[0].uri);
        }
      } catch (error) {
        console.error('Error fetching event types:', error);
      }
    };

    // Fetch scheduled events
    const fetchEvents = async () => {
      try {
        const startTime = new Date().toISOString();
        const endTime = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // Next 30 days
        const response = await axios.get('/calendly/events', {
          params: { startTime, endTime }
        });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEventTypes();
    fetchEvents();

    // Set up Socket.IO connection for real-time updates
    const socket = io('http://localhost:6008');

    socket.on('calendly_update', (data) => {
      if (data.type === 'new_booking') {
        setEvents(prevEvents => [...prevEvents, data.data]);
      } else if (data.type === 'canceled_booking') {
        setEvents(prevEvents => 
          prevEvents.filter(event => event.uri !== data.data.uri)
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [mentorId]);

  const createSchedulingLink = async () => {
    try {
      const response = await axios.post('/calendly/scheduling-link', {
        mentorId,
        eventTypeUuid: selectedEventType.split('/').pop()
      });
      setSchedulingLink(response.data.booking_url);
    } catch (error) {
      console.error('Error creating scheduling link:', error);
    }
  };

  return (
    <div className="calendly-scheduler">
      <h2>Schedule a Session</h2>
      
      <div className="event-types">
        <h3>Select Session Type</h3>
        <select 
          value={selectedEventType} 
          onChange={(e) => setSelectedEventType(e.target.value)}
        >
          {eventTypes.map(type => (
            <option key={type.uri} value={type.uri}>
              {type.name} ({type.duration} minutes)
            </option>
          ))}
        </select>
      </div>

      <button onClick={createSchedulingLink}>
        Create Scheduling Link
      </button>

      {schedulingLink && (
        <div className="scheduling-link">
          <h3>Share this link with your mentee:</h3>
          <a href={schedulingLink} target="_blank" rel="noopener noreferrer">
            {schedulingLink}
          </a>
        </div>
      )}

      <div className="scheduled-events">
        <h3>Upcoming Sessions</h3>
        {events.map(event => (
          <div key={event.uri} className="event-card">
            <h4>{event.event_type_name}</h4>
            <p>Date: {format(new Date(event.start_time), 'PPP')}</p>
            <p>Time: {format(new Date(event.start_time), 'p')}</p>
            <p>Duration: {event.event_type_duration} minutes</p>
            <p>Status: {event.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendlyScheduler; 