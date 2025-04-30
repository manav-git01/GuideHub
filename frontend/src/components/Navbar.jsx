import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Navbar.css';
import guidehubLogo from '../assets/logo.jpg';
// import logo from '../assets/logo.png';
const Navbar = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={guidehubLogo} alt="GuideHub Logo" className="navbar-logo-image" />
          <span className="logo-text">GUIDEHUB</span>
        </Link>

        <div className="nav-menu-container">
          {isLoggedIn ? (
            <>
              <div className="nav-menu">
                <Link to="/vision" className="nav-link">Vision</Link>
                <Link to="/explore" className="nav-link">Explore</Link>
                <Link to="/reachout" className="nav-link">Reachout</Link>
                <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
              </div>
            
            </>
          ) : (
            <div className="nav-buttons">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        <div className="mobile-menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <i className={isOpen ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
      </div>

      {isOpen && (
        <motion.div 
          className="mobile-menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isLoggedIn ? (
            <>
              <Link to="/vision" className="mobile-link" onClick={() => setIsOpen(false)}>
                Vision
              </Link>
              <Link to="/explore" className="mobile-link" onClick={() => setIsOpen(false)}>
                Explore
              </Link>
              <Link to="/reachout" className="mobile-link" onClick={() => setIsOpen(false)}>
                Reachout
              </Link>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-link" onClick={() => setIsOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className="mobile-link" onClick={() => setIsOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;