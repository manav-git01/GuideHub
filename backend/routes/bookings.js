import express from 'express';
import auth from '../middleware/auth.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Mentor from '../models/Mentor.js';

const router = express.Router();

// @route   POST api/bookings
// @desc    Create a new booking
// @access  Private (mentee only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is a mentee
    const user = await User.findById(req.user.id);
    if (user.userType !== 'mentee') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { mentorId, date, timeSlot, notes } = req.body;
    
    // Check if mentor exists
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.userType !== 'mentor') {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    // Create new booking
    const booking = new Booking({
      mentor: mentorId,
      mentee: req.user.id,
      date: new Date(date),
      timeSlot,
      notes
    });
    
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/mentee
// @desc    Get all bookings for a mentee
// @access  Private (mentee only)
router.get('/mentee', auth, async (req, res) => {
  try {
    // Check if user is a mentee
    const user = await User.findById(req.user.id);
    if (user.userType !== 'mentee') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const bookings = await Booking.find({ mentee: req.user.id })
      .populate('mentor', ['name', 'email', 'profilePicture'])
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/bookings/mentor
// @desc    Get all bookings for a mentor
// @access  Private (mentor only)
router.get('/mentor', auth, async (req, res) => {
  try {
    // Check if user is a mentor
    const user = await User.findById(req.user.id);
    if (user.userType !== 'mentor') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const bookings = await Booking.find({ mentor: req.user.id })
      .populate('mentee', ['name', 'email', 'profilePicture'])
      .sort({ date: 1 });
    
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/bookings/:id/status
// @desc    Update booking status
// @access  Private (mentor only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    
    // Check if booking exists
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the mentor for this booking
    if (booking.mentor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Update booking
    booking.status = status;
    if (meetingLink) booking.meetingLink = meetingLink;
    
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/bookings/:id
// @desc    Cancel a booking
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if booking exists
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is the mentee or mentor for this booking
    if (booking.mentee.toString() !== req.user.id && booking.mentor.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    // Delete booking
    await booking.remove();
    
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;