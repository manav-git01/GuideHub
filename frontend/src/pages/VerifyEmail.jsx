import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import './VerifyEmail.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/auth/verify-email/${token}`);
        setVerificationStatus('success');
        setMessage('Email verified successfully! You can now log in.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setVerificationStatus('error');
        setMessage(error.response?.data?.msg || 'Verification failed. The link may have expired.');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="verify-email-page">
      <Navbar isLoggedIn={false} />
      <div className="verify-email-container">
        <div className={`verification-box ${verificationStatus}`}>
          <h1>Email Verification</h1>
          {verificationStatus === 'verifying' && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Verifying your email...</p>
            </div>
          )}
          {verificationStatus === 'success' && (
            <div className="success">
              <i className="fas fa-check-circle"></i>
              <p>{message}</p>
            </div>
          )}
          {verificationStatus === 'error' && (
            <div className="error">
              <i className="fas fa-exclamation-circle"></i>
              <p>{message}</p>
              <button onClick={() => navigate('/login')} className="back-to-login">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 