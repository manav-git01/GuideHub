import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import axios from '../utils/axios';
import Navbar from '../components/Navbar';
import './AuthPages.css';

const LoginPage = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'mentee' // Default to mentee
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/auth/login', formData);
      
      // Check if email needs verification
      if (response.status === 401 && !response.data.isEmailVerified) {
        setError('Please check your email for the verification link. A new verification email has been sent.');
        return;
      }
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      setUser(response.data.user);
      
      // Redirect based on user type
      if (formData.userType === 'mentee') {
        navigate('/explore');
      } else {
        navigate('/mentor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post('/auth/google', {
        credential: credentialResponse.credential,
        userType: formData.userType // Pass the selected user type
      });
      
      // Store user data and token
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
      
      setUser(response.data.user);
      
      // Redirect based on user type
      if (response.data.user.userType === 'mentee') {
        navigate('/explore');
      } else {
        navigate('/mentor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google login failed. Please try again.');
    }
  };

  return (
    <div className="auth-page">
      <Navbar isLoggedIn={false} />
      
      <div className="auth-container">
        <motion.div 
          className="auth-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="auth-title">Login to GUIDEHUB</h2>
          
          <div className="user-type-toggle">
            <button 
              className={`toggle-btn ${formData.userType === 'mentee' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, userType: 'mentee'})}
            >
              Mentee
            </button>
            <button 
              className={`toggle-btn ${formData.userType === 'mentor' ? 'active' : ''}`}
              onClick={() => setFormData({...formData, userType: 'mentor'})}
            >
              Mentor
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-control">
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
            
            <div className="form-control">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  className="see-password"
                  onClick={togglePassword}
                >
                  {showPassword ? 'Hide' : 'See'}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot Password?
              </Link>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="google-login">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                setError('Google login failed. Please try again.');
              }}
              useOneTap
            />
          </div>
          
          <p className="auth-redirect">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;