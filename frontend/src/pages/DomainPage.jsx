import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import MentorCard from '../components/MentorCard';
import './DomainPage.css';

// Mock data for AWS mentors
const awsMentors = [
  {
    id: 'mentor1',
    name: 'Sanket Suthar',
    domain: 'AWS',
    experience: 'AWS Solutions Architect at Amazon, 5 years',
    skills: 'AWS Lambda, EC2, S3, CloudFormation',
    achievements: 'Designed scalable architectures for 20+ clients'
  },
  {
    id: 'mentor2',
    name: 'Purvi Prajapati',
    domain: 'AWS',
    experience: 'Cloud Engineer at AWS Partner Network, 4 years',
    skills: 'AWS RDS, VPC, IAM, Terraform',
    achievements: 'Led migration of 10 enterprise apps to AWS'
  },
 
];

const domainData = {
  aws: {
    title: 'AWS MENTORS',
    image: 'https://wallpaperaccess.com/full/3209833.jpg',
    mentors: awsMentors
  },
  frontend: {
    title: 'FRONTEND DEVELOPMENT MENTORS',
    image: 'https://kodmek.com/wp-content/uploads/2021/01/front-end-developer-1600x900-1.jpg',
    mentors: [
      {
        id: 'mentor4',
        name: 'Ravi Patel',
        domain: 'Frontend',
        experience: 'Senior Frontend Developer at Google, 6 years',
        skills: 'React, Vue, Angular, JavaScript, CSS',
        achievements: 'Built UI components used by millions of users'
      },
      {
        id: 'mentor5',
        name: 'Jalpesh Vasa',
        domain: 'Frontend',
        experience: 'UI Engineer at Facebook, 4 years',
        skills: 'React, Redux, TypeScript, Tailwind CSS',
        achievements: 'Contributed to open source React libraries'
      }
    ]
  },
  cybersecurity: {
    title: 'CYBER SECURITY MENTORS',
    image: 'https://cioafrica.co/wp-content/uploads/2024/01/cyber-security.jpeg',
    mentors: [
      {
        id: 'mentor6',
        name: 'Pritesh Prajapati',
        domain: 'Cyber Security',
        experience: 'Security Engineer at Microsoft, 7 years',
        skills: 'Penetration Testing, Network Security, Encryption',
        achievements: 'Identified critical vulnerabilities in enterprise systems'
      },
      {
        id: 'mentor7',
        name: 'Madhav Ajwalia',
        domain: 'Cyber Security',
        experience: 'CISO at FinTech Corp, 5 years',
        skills: 'Security Architecture, Compliance, Risk Management',
        achievements: 'Implemented security protocols for banking applications'
      }
    ]
  },

  aiml: {
    title: 'AI/ML MENTORS',
    image: 'https://erode-sengunthar.ac.in/wp-content/uploads/2024/02/aiml-image-1.png',
    
    mentors: [
      {
        id: 'mentor6',
        name: 'Priyanka Patel',
        domain: 'Ai/ML',
        experience: 'AI Researcher at Google, 8 years',
        skills: 'Machine Learning, Deep Learning, TensorFlow',
        achievements: 'Published 10+ papers in top AI conferences'
      },
      {
        id: 'mentor7',
        name: 'Hemant Yadav',
        domain: 'ML',
        experience: 'Data Scientist at Amazon, 5 years',
        skills: 'Python, R, Data Analysis, Predictive Modeling',
        achievements: 'Developed ML models for product recommendations'
      }
    ]
  },

  devops: {
    title: 'Devops MENTORS',
    image: 'https://wallpapercave.com/wp/wp7848258.jpg',
    
    mentors: [
      {
        id: 'mentor6',
        name: 'Mikin Patel',
        domain: 'DevOps',
        experience: 'DevOps Engineer at Google, 6 years',
        skills: 'Docker, Kubernetes, Jenkins, CI/CD',
        achievements: 'Implemented CI/CD pipelines for 10+ projects'
      },
      {
        id: 'mentor7',
        name: 'Pavitra Modi',
        domain: 'DevOps',
        experience: 'Site Reliability Engineer at Amazon, 5 years',
        skills: 'AWS, Terraform, Ansible, Monitoring',
        achievements: 'Reduced downtime by 30% through automation'
      }
    ]
  },
};

// Notification component
const Notification = ({ message, type, onClose }) => {
  return (
    <motion.div
      className={`notification ${type}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="notification-content">
        <span className="notification-icon">
          {type === 'success' ? '✓' : type === 'error' ? '✕' : '!'}
        </span>
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>×</button>
    </motion.div>
  );
};

// Razorpay script loader
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const DomainPage = () => {
  const { domainName } = useParams();
  const [domain, setDomain] = useState(null);
  const containerRef = useRef(null);
  const [openCalendlyMentorId, setOpenCalendlyMentorId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call
    setDomain(domainData[domainName] || domainData.aws);
  }, [domainName]);

  const openRazorpay = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      setNotification({
        message: 'Payment system failed to load. Please try again.',
        type: 'error'
      });
      return;
    }
    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Razorpay test key
      amount: 50000, // 500.00 INR in paise
      currency: 'INR',
      name: 'GuideHub',
      description: 'Mentorship Session Payment',
      image: '/guidehub-favicon.jpg',
      handler: function (response) {
        setNotification({
          message: `Payment successful! Payment ID: ${response.razorpay_payment_id}`,
          type: 'success'
        });
      },
      prefill: {
        name: 'GuideHub User',
        email: 'user@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#4facfe'
      },
      modal: {
        ondismiss: function() {
          setNotification({
            message: 'Payment was cancelled. Please complete the payment to confirm your session.',
            type: 'warning'
          });
        }
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const handler = async (e) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        setNotification({
          message: 'Session scheduled successfully! Please complete the payment to confirm your booking.',
          type: 'success'
        });
        // Open Razorpay payment modal after Calendly booking
        await openRazorpay();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  // Auto-remove notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  if (!domain) {
    return <div>Loading...</div>;
  }

  return (
    <div className="domain-page">
      <Navbar isLoggedIn={true} />
      
      <div className="notifications-container">
        <AnimatePresence>
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              onClose={() => setNotification(null)}
            />
          )}
        </AnimatePresence>
      </div>
      
      <div className="container">
        <div className="domain-header">
          <div className="domain-image-container">
            <img 
              src={domain.image} 
              alt={domain.title} 
              className="domain-image"
            />
          </div>
          <h1 className="domain-title">{domain.title}</h1>
        </div>
        
        <div className="mentors-section">
          <button className="scroll-button left" onClick={scrollLeft}>
            <span className="arrow">←</span>
          </button>
          
          <div className="mentors-grid" ref={containerRef}>
            {domain.mentors.map((mentor, index) => (
              <MentorCard 
                key={mentor.id}
                mentor={mentor}
                index={index}
                showCalendly={openCalendlyMentorId === mentor.id}
                onOpenCalendly={() => setOpenCalendlyMentorId(mentor.id)}
              />
            ))}
          </div>

          <button className="scroll-button right" onClick={scrollRight}>
            <span className="arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DomainPage;