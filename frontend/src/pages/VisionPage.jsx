import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import './VisionPage.css';

const VisionPage = () => {
  return (
    <div className="vision-page">
      <Navbar isLoggedIn={true} />
      
      <div className="vision-container">
        <motion.div 
          className="vision-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Our Vision</h1>
          <p>Empowering the next generation of tech leaders through personalized mentorship</p>
        </motion.div>

        <div className="vision-content">
          <motion.section 
            className="vision-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2>Mission Statement</h2>
            <p>To bridge the gap between aspiring professionals and industry experts, creating a collaborative ecosystem that fasters growth, innovation, and knowledge sharing.</p>
          </motion.section>

          <motion.section 
            className="vision-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2>Core Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Excellence</h3>
                <p>Striving for the highest standards in mentorship and learning</p>
              </div>
              <div className="value-card">
                <h3>Innovation</h3>
                <p>Embracing new ideas and approaches to problem-solving</p>
              </div>
              <div className="value-card">
                <h3>Collaboration</h3>
                <p>Building strong relationships between mentors and mentees</p>
              </div>
              <div className="value-card">
                <h3>Growth</h3>
                <p>Fostering continuous personal and professional development</p>
              </div>
            </div>
          </motion.section>

          <motion.section 
            className="vision-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h2>Our Goals</h2>
            <div className="goals-list">
              <div className="goal-item">
                <h3>Skill Development</h3>
                <p>Provide structured learning paths and hands-on guidance in various technical and non-technical domains</p>
              </div>
              <div className="goal-item">
                <h3>Career Growth</h3>
                <p>Help professionals navigate their career paths and achieve their professional aspirations</p>
              </div>
              <div className="goal-item">
                <h3>Community Building</h3>
                <p>Create a supportive network of mentors and mentees who share knowledge and experiences</p>
              </div>
            </div>
          </motion.section>

          <motion.section 
            className="vision-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h2>Future Outlook</h2>
            <p>We envision GuideHub becoming the premier platform for professional mentorship, known for:</p>
            <ul className="future-list">
              <li>Innovative mentorship programs tailored to individual needs</li>
              <li>Strong industry partnerships and collaborations</li>
              <li>Global reach with diverse mentor and mentee communities</li>
              <li>Cutting-edge learning resources and tools</li>
              <li>Measurable impact on career growth and skill development</li>
            </ul>
          </motion.section>
        </div>
      </div>
    </div>
  );
};

export default VisionPage; 