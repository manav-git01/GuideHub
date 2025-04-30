import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './AuthPages.css';

const VerificationPending = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 10 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-page">
      <Navbar isLoggedIn={false} />
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Email Verification Required</h2>
          <div className="verification-message">
            <p>Please check your email for the verification link.</p>
            <p>We have sent a verification email to your registered email address.</p>
            <p>Click the link in the email to verify your account.</p>
            <p>You will be redirected to the login page in 10 seconds...</p>
          </div>
          <button 
            className="auth-button"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationPending; 