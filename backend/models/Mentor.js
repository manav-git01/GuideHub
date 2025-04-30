import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  domain: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  availability: [{
    day: {
      type: String,
      required: true
    },
    slots: [{
      type: String
    }]
  }],
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true
    },
    comment: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
});

export default mongoose.model('Mentor', MentorSchema);