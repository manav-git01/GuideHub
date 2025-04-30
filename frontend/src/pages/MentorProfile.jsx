import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import './MentorProfile.css';

// Mock mentor data
const mentorsData = {
  mentor1: {
    id: 'mentor1',
    name: 'Tal Hibner',
    avatar: '/images/tal-avatar.jpg',
    domain: 'AWS',
    title: 'AWS Solutions Architect',
    company: 'Amazon',
    experience: '5 years',
    skills: ['AWS Lambda', 'EC2', 'S3', 'CloudFormation', 'DynamoDB', 'API Gateway'],
    bio: 'Experienced AWS Solutions Architect with a passion for designing scalable and resilient cloud architectures. I help companies leverage AWS services to build efficient and cost-effective solutions.',
    achievements: [
      'Designed scalable architectures for 20+ clients',
      'AWS Certified Solutions Architect - Professional',
      'AWS Certified DevOps Engineer - Professional',
      'Speaker at AWS re:Invent 2022'
    ],
    availability: [
      { day: 'Monday', slots: ['10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM'] },
      { day: 'Wednesday', slots: ['9:00 AM - 10:00 AM', '4:00 PM - 5:00 PM'] },
      { day: 'Friday', slots: ['1:00 PM - 2:00 PM', '5:00 PM - 6:00 PM'] }
    ],
    rating: 4.9,
    reviews: [
      { id: 1, user: 'John D.', rating: 5, comment: 'Tal is an excellent mentor! He helped me understand complex AWS concepts in a simple way.' },
      { id: 2, user: 'Sarah M.', rating: 5, comment: 'Great session on serverless architecture. Very knowledgeable and patient.' },
      { id: 3, user: 'Michael R.', rating: 4, comment: 'Provided practical insights for my cloud migration project. Would recommend!' }
    ]
  },
  // Add other mentors here
};

const MentorProfile = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call
    setMentor(mentorsData[mentorId]);
  }, [mentorId]);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookSession = () => {
    // In a real app, this would be an API call to book the session
    setBookingStatus('success');
    // Reset after 3 seconds
    setTimeout(() => {
      setBookingStatus(null);
      setSelectedDate(null);
      setSelectedSlot(null);
    }, 3000);
  };

  if (!mentor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mentor-profile-page">
      <Navbar isLoggedIn={true} />
      
      <div className="container">
        <div className="profile-grid">
          <motion.div 
            className="profile-sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="profile-header">
              <div className="profile-avatar">
                <img src={mentor.avatar || '/placeholder-user.jpg'} alt={mentor.name} />
              </div>
              <h1 className="profile-name">{mentor.name}</h1>
              <p className="profile-title">{mentor.title} at {mentor.company}</p>
              <div className="profile-rating">
                <span className="stars">{'★'.repeat(Math.floor(mentor.rating))}{'☆'.repeat(5 - Math.floor(mentor.rating))}</span>
                <span className="rating-value">{mentor.rating}</span>
              </div>
            </div>
            
            <div className="profile-section">
              <h2 className="section-title">About</h2>
              <p className="profile-bio">{mentor.bio}</p>
            </div>
            
            <div className="profile-section">
              <h2 className="section-title">Skills</h2>
              <div className="skills-list">
                {mentor.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="profile-section">
              <h2 className="section-title">Achievements</h2>
              <ul className="achievements-list">
                {mentor.achievements.map((achievement, index) => (
                  <li key={index}>{achievement}</li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          <motion.div 
            className="booking-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">Book a Session</h2>
            
            <div className="booking-container">
              <div className="calendar-container">
                <Calendar onDateSelect={handleDateSelect} availability={mentor.availability} />
              </div>
              
              {selectedDate && (
                <div className="time-slots">
                  <h3>Available Slots for {selectedDate.toDateString()}</h3>
                  <div className="slots-grid">
                    {mentor.availability
                      .find(day => day.day === selectedDate.toLocaleDateString('en-US', { weekday: 'long' }))
                      ?.slots.map((slot, index) => (
                        <button
                          key={index}
                          className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {slot}
                        </button>
                      ))}
                  </div>
                </div>
              )}
              
              {selectedSlot && (
                <div className="booking-confirmation">
                  <h3>Confirm Your Booking</h3>
                  <p>
                    <strong>Date:</strong> {selectedDate.toDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong> {selectedSlot}
                  </p>
                  <button 
                    className="btn btn-primary"
                    onClick={handleBookSession}
                  >
                    Book Session
                  </button>
                </div>
              )}
              
              {bookingStatus === 'success' && (
                <div className="booking-success">
                  <h3>Booking Successful!</h3>
                  <p>Your session has been booked. Check your email for details.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="reviews-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="section-title">Reviews</h2>
          <div className="reviews-container">
            {mentor.reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <span className="review-user">{review.user}</span>
                  <span className="review-rating">{'★'.repeat(review.rating)}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MentorProfile;