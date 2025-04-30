import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './MentorCard.css';

const calendlyUrl = 'https://calendly.com/guidehub/30min?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0e2a35&text_color=ffffff';

const MentorCard = ({ mentor, index, showCalendly, onOpenCalendly }) => {
  const calendlyRef = useRef(null);

  // Load Calendly script when needed
  useEffect(() => {
    if (showCalendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showCalendly]);

  return (
    <motion.div 
      className="mentor-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <h2 className="mentor-name">{mentor.name}</h2>
      <p className="mentor-domain">{mentor.domain}</p>
      <div className="mentor-section">
        <h3 className="section-title">EXPERIENCE</h3>
        <p>{mentor.experience}</p>
      </div>
      <div className="mentor-section">
        <h3 className="section-title">TECHNICAL SKILLSET</h3>
        <p>{mentor.skills}</p>
      </div>
      <div className="mentor-section">
        <h3 className="section-title">ACHIEVEMENTS</h3>
        <p>{mentor.achievements}</p>
      </div>
      <div className="mentor-actions">
        <button 
          className="connect-btn full-width"
          onClick={onOpenCalendly}
          disabled={showCalendly}
        >
          Schedule Session
        </button>
      </div>
      {showCalendly && (
        <div className="calendly-inline-widget-container" style={{ marginTop: '1rem' }}>
          <div
            ref={calendlyRef}
            className="calendly-inline-widget"
            data-url={calendlyUrl}
            style={{ minWidth: '320px', height: '700px' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default MentorCard;
