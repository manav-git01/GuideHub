import express from 'express';
import { getScheduledEvents, createSchedulingLink, getEventTypes, handleWebhook } from '../services/calendlyService.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get scheduled events
router.get('/events', auth, async (req, res) => {
  try {
    const { startTime, endTime } = req.query;
    const events = await getScheduledEvents(startTime, endTime);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching scheduled events' });
  }
});

// Create scheduling link
router.post('/scheduling-link', auth, async (req, res) => {
  try {
    const { mentorId, eventTypeUuid } = req.body;
    const link = await createSchedulingLink(mentorId, eventTypeUuid);
    res.json(link);
  } catch (error) {
    res.status(500).json({ message: 'Error creating scheduling link' });
  }
});

// Get event types for a mentor
router.get('/event-types/:mentorId', auth, async (req, res) => {
  try {
    const { mentorId } = req.params;
    const eventTypes = await getEventTypes(mentorId);
    res.json(eventTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event types' });
  }
});

// Webhook endpoint for Calendly
router.post('/webhook', async (req, res) => {
  try {
    const webhookData = await handleWebhook(req.body);
    if (webhookData) {
      // Emit socket event for real-time updates
      req.app.get('io').emit('calendly_update', webhookData);
    }
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing webhook' });
  }
});

export default router; 