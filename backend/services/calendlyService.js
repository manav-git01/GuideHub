import axios from 'axios';
import { CALENDLY_API_KEY, CALENDLY_BASE_URL } from '../config/calendly.js';

const calendlyApi = axios.create({
  baseURL: CALENDLY_BASE_URL,
  headers: {
    'Authorization': `Bearer ${CALENDLY_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const getScheduledEvents = async (startTime, endTime) => {
  try {
    const response = await calendlyApi.get('/scheduled_events', {
      params: {
        start_time: startTime,
        end_time: endTime
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Calendly events:', error);
    throw error;
  }
};

export const createSchedulingLink = async (mentorId, eventTypeUuid) => {
  try {
    const response = await calendlyApi.post('/scheduling_links', {
      owner: `https://api.calendly.com/users/${mentorId}`,
      event_type: eventTypeUuid
    });
    return response.data;
  } catch (error) {
    console.error('Error creating scheduling link:', error);
    throw error;
  }
};

export const getEventTypes = async (mentorId) => {
  try {
    const response = await calendlyApi.get('/event_types', {
      params: {
        user: `https://api.calendly.com/users/${mentorId}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event types:', error);
    throw error;
  }
};

export const handleWebhook = async (payload) => {
  try {
    // Process the webhook payload
    const { event, payload: eventPayload } = payload;
    
    switch (event) {
      case 'invitee.created':
        // Handle new booking
        return {
          type: 'new_booking',
          data: eventPayload
        };
      case 'invitee.canceled':
        // Handle canceled booking
        return {
          type: 'canceled_booking',
          data: eventPayload
        };
      default:
        return null;
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw error;
  }
}; 