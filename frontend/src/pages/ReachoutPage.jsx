import { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import './ReachoutPage.css';

const ReachoutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    purpose: 'general' // general, mentorship, business, support
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        purpose: 'general'
      });
    }, 1500);
  };

  return (
    <div className="reachout-page">
      <Navbar isLoggedIn={true} />
      
      <div className="reachout-container">
        <motion.div 
          className="reachout-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Reach Out To Us</h1>
          <p>Have questions? We're here to help and listen</p>
        </motion.div>

        <div className="reachout-content">
          <motion.div 
            className="contact-info"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="info-card">
              <h3>Contact Information</h3>
              <p>Email: support@guidehub.com</p>
              <p>Hours: Monday-Friday, 9:00 AM-6:00 PM IST</p>
            </div>

            <div className="info-card">
              <h3>Office Location</h3>
              <p>Charusat University</p>
              <p>Changa, Gujarat</p>
              <p>India - 388421</p>
            </div>

            <div className="info-card">
              <h3>Connect With Us</h3>
              <div className="social-links">
                <a href="#" className="social-link">LinkedIn</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Facebook</a>
              </div>
            </div>
          </motion.div>

          <motion.form 
            className="contact-form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="purpose">Purpose</label>
              <select
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                required
              >
                <option value="general">General Inquiry</option>
                <option value="mentorship">Mentorship Program</option>
                <option value="business">Business Partnership</option>
                <option value="support">Technical Support</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="submit-button"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <motion.div 
                className="success-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Thank you for reaching out! We'll get back to you soon.
              </motion.div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ReachoutPage; 