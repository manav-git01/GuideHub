import express from 'express';
import auth from '../middleware/auth.js';
import Mentor from '../models/Mentor.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET api/mentors
// @desc    Get all mentors
// @access  Public
router.get('/', async (req, res) => {
  try {
    const mentors = await Mentor.find()
      .populate('user', ['name', 'email', 'profilePicture']);
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/mentors/domain/:domain
// @desc    Get mentors by domain
// @access  Public
router.get('/domain/:domain', async (req, res) => {
  try {
    const mentors = await Mentor.find({ domain: req.params.domain })
      .populate('user', ['name', 'email', 'profilePicture']);
    res.json(mentors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/mentors/:id
// @desc    Get mentor by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
      .populate('user', ['name', 'email', 'profilePicture', 'bio'])
      .populate('reviews.user', ['name', 'profilePicture']);
    
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    res.json(mentor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    res.status(500).send('Server error');
  }
});

// @route   PUT api/mentors/profile
// @desc    Update mentor profile
// @access  Private (mentor only)
router.put('/profile', auth, async (req, res) => {
  try {
    // Check if user is a mentor
    const user = await User.findById(req.user.id);
    if (user.userType !== 'mentor') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const {
      title,
      company,
      experience,
      domain,
      skills,
      achievements,
      availability
    } = req.body;
    
    // Build mentor profile object
    const profileFields = {};
    if (title) profileFields.title = title;
    if (company) profileFields.company = company;
    if (experience) profileFields.experience = experience;
    if (domain) profileFields.domain = domain;
    if (skills) profileFields.skills = skills;
    if (achievements) profileFields.achievements = achievements;
    if (availability) profileFields.availability = availability;
    
    // Update mentor profile
    let mentor = await Mentor.findOne({ user: req.user.id });
    
    if (mentor) {
      mentor = await Mentor.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true }
      );
      
      return res.json(mentor);
    }
    
    // Create mentor profile if not found
    mentor = new Mentor({
      user: req.user.id,
      ...profileFields
    });
    
    await mentor.save();
    res.json(mentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/mentors/:id/review
// @desc    Add review for a mentor
// @access  Private (mentee only)
router.post('/:id/review', auth, async (req, res) => {
  try {
    // Check if user is a mentee
    const user = await User.findById(req.user.id);
    if (user.userType !== 'mentee') {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const { rating, comment } = req.body;
    
    const mentor = await Mentor.findById(req.params.id);
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found' });
    }
    
    // Check if user already reviewed this mentor
    const alreadyReviewed = mentor.reviews.find(
      review => review.user.toString() === req.user.id
    );
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Mentor already reviewed' });
    }
    
    // Add review
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };
    
    mentor.reviews.push(review);
    
    // Update mentor rating
    mentor.rating = mentor.reviews.reduce((acc, item) => item.rating + acc, 0) / mentor.reviews.length;
    
    await mentor.save();
    res.json(mentor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;