import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, userType, children }) => {
  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If userType is specified, check if user has the correct type
  if (userType && user.userType !== userType) {
    // Redirect to appropriate dashboard
    if (user.userType === 'mentor') {
      return <Navigate to="/mentor/dashboard" replace />;
    } else {
      return <Navigate to="/explore" replace />;
    }
  }
  
  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;