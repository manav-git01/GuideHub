import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import './ExplorePage.css';

const allDomains = {
  'WEB TECHNOLOGIES': [
    {
      id: 'aws',
      name: 'AWS',
      image: 'https://wallpaperaccess.com/full/3209833.jpg',
      description: 'Amazon Web Services cloud computing and infrastructure'
    },
    {
      id: 'frontend',
      name: 'Frontend Development',
      image: 'https://kodmek.com/wp-content/uploads/2021/01/front-end-developer-1600x900-1.jpg',
      description: 'Web development with HTML, CSS, JavaScript, and modern frameworks'
    },
    {
      id: 'cybersecurity',
      name: 'Cyber Security',
      image: 'https://cioafrica.co/wp-content/uploads/2024/01/cyber-security.jpeg',
      description: 'Network security, ethical hacking, and data protection'
    },
    {
      id: 'aiml',
      name: 'AI/ML',
      image: 'https://erode-sengunthar.ac.in/wp-content/uploads/2024/02/aiml-image-1.png',
      description: 'DEEP LEARNING, MACHINE LEARNING, ARTIFICIAL INTELLIGENCE'
    },
    {
      id: 'devops',
      name: 'DevOps',
      image: 'https://wallpapercave.com/wp/wp7848258.jpg',
      description: 'Development operations, CI/CD, and automation'
    }
  ],
  'NON-TECHNICAL': [
    {
      id: 'career_guidance',
      name: 'Career Guidance',
      image: 'https://cdn.educba.com/academy/wp-content/uploads/2016/12/Career-Guidance-Lessons.jpg',
      description: 'Career planning and professional development guidance'
    },
    {
      id: 'leadership',
      name: 'Leadership',
      image: 'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/k-10-maew-15099-olj1331-1-leadership.jpg?w=1000&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=5c4dcf606e617e2b0e8782c07a85e1ef',
      description: 'Leadership skills and management training'
    },
    {
      id: 'communication',
      name: 'Communication Skills',
      image: 'https://answerfirst.com/wp-content/uploads/2018/04/communication-1024x556.jpeg',
      description: 'Effective communication and presentation skills'
    },
    {
      id: 'project-management',
      name: 'Project Management',
      image: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/project_management_coursefees.jpg',
      description: 'Project planning, execution, and team management'
    },
    {
      id: 'business-analysis',
      name: 'Business Analysis',
      image: 'https://www.pathwaysinternational.com/wp-content/uploads/2018/06/Big-data-analytics-solutions.jpg',
      description: 'Business process analysis and improvement'
    }
  ],
  'CORE DOMAINS': [
    {
      id: 'software-engineering',
      name: 'Software Engineering',
      image: 'https://www.pgc.edu/wp-content/uploads/2021/09/Software-Engineering.jpg',
      description: 'Software development principles and best practices'
    },
    {
      id: 'product-management',
      name: 'Product Management',
      image: 'https://backend.insideiim.com/wp-content/uploads/2019/04/Product-Management.jpg',
      description: 'Product strategy and development lifecycle'
    },
    {
      id: 'data-science',
      name: 'Data Science',
      image: 'https://www.simplilearn.com/ice9/free_resources_article_thumb/Data-Science-vs.-Big-Data-vs.jpg',
      description: 'Data analysis, machine learning, and statistics'
    },
    {
      id: 'cloud-computing',
      name: 'Cloud Computing',
      image: 'https://s3.amazonaws.com/hoth.bizango/images/797280/cloud-computing-msc_feature.jpg',
      description: 'Cloud platforms, services, and architecture'
    },
    {
      id: 'system-architecture',
      name: 'System Architecture',
      image: 'https://www.interviewbit.com/blog/wp-content/uploads/2022/06/System-Architecture.png',
      description: 'System design and architectural patterns'
    }
  ],
  'MEDIA & DESIGN': [
    {
      id: 'ui-ux',
      name: 'UI/UX Design',
      image: 'https://wallpaperaccess.com/full/6000163.jpg',
      description: 'User interface and experience design'
    },
    {
      id: 'graphic-design',
      name: 'Graphic Design',
      image: 'https://exonext.com/wp-content/uploads/2024/04/Graphic-Design-1.png',
      description: 'Visual design and branding'
    },
    {
      id: 'motion-graphics',
      name: 'Motion Graphics',
      image: 'https://coderstrustbd.com/wp-content/uploads/2021/08/Motion-Graphics.jpg',
      description: 'Animation and motion design'
    },
    {
      id: 'digital-marketing',
      name: 'Digital Marketing',
      image: 'https://d36lty2xa4smx3.cloudfront.net/product-images/b_2754.jpg',
      description: 'Online marketing and social media'
    },
    {
      id: 'content-creation',
      name: 'Content Creation',
      image: 'https://d2gg9evh47fn9z.cloudfront.net/1600px_COLOURBOX43975736.jpg',
      description: 'Content strategy and development'
    }
  ]
};

const sidebarSections = {
  'WEB TECHNOLOGIES': [
    { id: 'aws', name: 'AWS' },
    { id: 'frontend', name: 'Frontend Development' },
    { id: 'cybersecurity', name: 'Cyber Security' },
    { id: 'backend', name: 'Backend Development' },
    { id: 'devops', name: 'DevOps' }
  ],
  'NON-TECHNICAL': [
    { id: 'career-guidance', name: 'Career Guidance' },
    { id: 'leadership', name: 'Leadership' },
    { id: 'communication', name: 'Communication Skills' },
    { id: 'project-management', name: 'Project Management' },
    { id: 'business-analysis', name: 'Business Analysis' }
  ],
  'CORE DOMAINS': [
    { id: 'software-engineering', name: 'Software Engineering' },
    { id: 'product-management', name: 'Product Management' },
    { id: 'data-science', name: 'Data Science' },
    { id: 'cloud-computing', name: 'Cloud Computing' },
    { id: 'system-architecture', name: 'System Architecture' }
  ],
  'MEDIA & DESIGN': [
    { id: 'ui-ux', name: 'UI/UX Design' },
    { id: 'graphic-design', name: 'Graphic Design' },
    { id: 'motion-graphics', name: 'Motion Graphics' },
    { id: 'digital-marketing', name: 'Digital Marketing' },
    { id: 'content-creation', name: 'Content Creation' }
  ]
};

const ExplorePage = () => {
  const [user, setUser] = useState(null);
  const [currentSlides, setCurrentSlides] = useState({
    'WEB TECHNOLOGIES': 0,
    'NON-TECHNICAL': 0,
    'CORE DOMAINS': 0,
    'MEDIA & DESIGN': 0
  });
  const carouselRefs = {
    'WEB TECHNOLOGIES': useRef(null),
    'NON-TECHNICAL': useRef(null),
    'CORE DOMAINS': useRef(null),
    'MEDIA & DESIGN': useRef(null)
  };
  const [expandedSection, setExpandedSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState('WEB TECHNOLOGIES');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleScroll = (section) => {
    const ref = carouselRefs[section];
    if (ref.current) {
      const scrollLeft = ref.current.scrollLeft;
      const itemWidth = ref.current.offsetWidth / 3;
      const newSlide = Math.round(scrollLeft / itemWidth);
      setCurrentSlides(prev => ({ ...prev, [section]: newSlide }));
    }
  };

  const scrollTo = (section, index) => {
    const ref = carouselRefs[section];
    if (ref.current) {
      const itemWidth = ref.current.offsetWidth / 3;
      ref.current.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
      setCurrentSlides(prev => ({ ...prev, [section]: index }));
    }
  };

  const handlePrevClick = (section) => {
    const newSlide = Math.max(0, currentSlides[section] - 1);
    scrollTo(section, newSlide);
  };

  const handleNextClick = (section) => {
    const newSlide = Math.min(allDomains[section].length - 3, currentSlides[section] + 1);
    scrollTo(section, newSlide);
  };

  useEffect(() => {
    const carousel = carouselRefs['WEB TECHNOLOGIES'].current;
    if (carousel) {
      carousel.addEventListener('scroll', () => handleScroll('WEB TECHNOLOGIES'));
      return () => carousel.removeEventListener('scroll', () => handleScroll('WEB TECHNOLOGIES'));
    }
  }, []);

  const toggleSection = (sectionName) => {
    setExpandedSection(expandedSection === sectionName ? null : sectionName);
    setSelectedSection(sectionName);
  };

  useEffect(() => {
    const handler = async (e) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        // Show Razorpay modal here
        await openRazorpay();
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="explore-page">
      <Navbar isLoggedIn={true} />
      
      <div className="page-container">
        <div className="sidebar">
          <h2 className="sidebar-title">NAVIGATION</h2>
          {Object.entries(sidebarSections).map(([section, items]) => (
            <div key={section} className="sidebar-section">
              <button 
                className={`section-header ${expandedSection === section ? 'expanded' : ''} ${selectedSection === section ? 'active' : ''}`}
                onClick={() => toggleSection(section)}
              >
                <h3 className="sidebar-section-title">{section}</h3>
                <span className="dropdown-arrow">{expandedSection === section ? '▼' : '▶'}</span>
              </button>
              <AnimatePresence>
                {expandedSection === section && (
                  <motion.ul
                    className="sidebar-menu"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {items.map((item) => (
                      <li key={item.id} className="sidebar-menu-item">
                        <Link to={`/domain/${item.id}`}>{item.name}</Link>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        
        <main className="main-content">
          <AnimatePresence mode="wait">
            {Object.entries(allDomains)
              .filter(([section]) => section === selectedSection)
              .map(([section, domains]) => (
                <motion.div 
                  key={section} 
                  className="domain-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h1 className="page-title">{section}</h1>
                  
                  <div className="domain-carousel">
                    <button 
                      className="carousel-nav prev" 
                      onClick={() => handlePrevClick(section)}
                      disabled={currentSlides[section] === 0}
                    >
                      <span>Previous</span>
                    </button>
                    
                    <div 
                      className="carousel-container" 
                      ref={carouselRefs[section]}
                      onScroll={() => handleScroll(section)}
                    >
                      {domains.map((domain, index) => (
                        <motion.div 
                          key={domain.id}
                          className="domain-card"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Link to={`/domain/${domain.id}`}>
                            <div className="domain-image">
                              <img src={domain.image || "/placeholder.svg"} alt={domain.name} />
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                    
                    <button 
                      className="carousel-nav next"
                      onClick={() => handleNextClick(section)}
                      disabled={currentSlides[section] >= domains.length - 3}
                    >
                      <span>Next</span>
                    </button>
                  </div>
                  
                  <div className="carousel-indicators">
                    {[...Array(Math.max(0, domains.length - 2))].map((_, index) => (
                      <button
                        key={index}
                        className={`indicator ${index === currentSlides[section] ? 'active' : ''}`}
                        onClick={() => scrollTo(section, index)}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default ExplorePage;