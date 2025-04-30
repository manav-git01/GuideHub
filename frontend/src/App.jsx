import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import VerificationPending from './pages/VerificationPending';
import ExplorePage from './pages/ExplorePage';
import DomainPage from './pages/DomainPage';
import MentorProfile from './pages/MentorProfile';
import MenteeDashboard from './pages/MenteeDashboard';
import MentorDashboard from './pages/MentorDashboard';
import VisionPage from './pages/VisionPage';
import ReachoutPage from './pages/ReachoutPage';
import VideoCall from './components/VideoCall';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/signup" element={<SignupPage setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verification-pending" element={<VerificationPending />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route 
            path="/explore" 
            element={
              <ProtectedRoute user={user}>
                <ExplorePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/domain/:domainName" 
            element={
              <ProtectedRoute user={user}>
                <DomainPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentor/:mentorId" 
            element={
              <ProtectedRoute user={user}>
                <MentorProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentee/dashboard" 
            element={
              <ProtectedRoute user={user} userType="mentee">
                <MenteeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentor/dashboard" 
            element={
              <ProtectedRoute user={user} userType="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/video-call/:sessionId" 
            element={
              <ProtectedRoute user={user}>
                <VideoCall />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vision" 
            element={
              <ProtectedRoute user={user}>
                <VisionPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reachout" 
            element={
              <ProtectedRoute user={user}>
                <ReachoutPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;