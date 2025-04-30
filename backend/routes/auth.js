import express from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import Mentor from '../models/Mentor.js';
import auth from '../middleware/auth.js';
import { 
  generateVerificationToken, 
  sendVerificationEmail, 
  sendPasswordResetEmail,
  sendLoginNotificationEmail 
} from '../utils/emailService.js';
import { transporter } from '../utils/emailService.js';

const router = express.Router();

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @route   POST api/auth/google
// @desc    Authenticate user with Google
// @access  Public
router.post('/google', async (req, res) => {
  try {
    const { credential, userType } = req.body;
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email });
    let isNewUser = false;
    
    if (!user) {
      isNewUser = true;
      // Create new user if doesn't exist
      const verificationToken = generateVerificationToken();
      user = new User({
        name,
        email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        userType: userType || 'mentee', // Use provided userType or default to mentee
        emailVerificationToken: verificationToken,
        emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      });
      await user.save();

      // If user is a mentor, create mentor profile
      if (user.userType === 'mentor') {
        const mentor = new Mentor({
          user: user._id,
          title: 'New Mentor',
          company: 'Not specified',
          experience: 'Not specified',
          domain: 'Not specified',
          skills: [],
          achievements: [],
          availability: []
        });
        await mentor.save();
      }

      // Send verification email for new users
      await sendVerificationEmail(email, verificationToken);
    } else {
      // Send login notification for existing users
      await sendLoginNotificationEmail(email);
    }
    
    // Create JWT token
    const tokenPayload = {
      user: {
        id: user._id,
        userType: user.userType
      }
    };
    
    jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            userType: user.userType,
            isEmailVerified: user.isEmailVerified,
            isNewUser
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/auth/verify-email/:token
// @desc    Verify user email
// @access  Public
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Verification attempt started for token:', token);
    
    // Find user with matching verification token
    const user = await User.findOne({
      emailVerificationToken: token
    });

    console.log('User search result:', user ? {
      email: user.email,
      isEmailVerified: user.isEmailVerified,
      token: user.emailVerificationToken,
      expires: user.emailVerificationExpires
    } : 'No user found');

    if (!user) {
      console.log('Verification failed: No user found with this token');
      return res.status(400).json({ msg: 'Invalid verification token' });
    }

    // Check if token has expired
    if (user.emailVerificationExpires && user.emailVerificationExpires < Date.now()) {
      console.log('Verification failed: Token expired');
      return res.status(400).json({ msg: 'Verification token has expired' });
    }

    // Update user's verification status
    try {
      const updateResult = await User.findByIdAndUpdate(
        user._id,
        {
          $set: {
            isEmailVerified: true,
            emailVerificationToken: null,
            emailVerificationExpires: null
          }
        },
        { new: true }
      );

      console.log('User verification update result:', {
        email: updateResult.email,
        isEmailVerified: updateResult.isEmailVerified,
        token: updateResult.emailVerificationToken
      });

      if (!updateResult) {
        throw new Error('Failed to update user verification status');
      }

      res.json({ 
        msg: 'Email verified successfully',
        user: {
          email: updateResult.email,
          isEmailVerified: updateResult.isEmailVerified
        }
      });
    } catch (updateError) {
      console.error('Error updating user verification:', updateError);
      throw updateError;
    }
  } catch (err) {
    console.error('Verification error:', err.message);
    res.status(500).json({ 
      msg: 'Server error during verification',
      error: err.message 
    });
  }
});

// @route   POST api/auth/signup
// @desc    Register a user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, userType } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create new user with verification token
    user = new User({
      name,
      email,
      password,
      userType,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    await user.save();

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Don't fail the signup if email sending fails
    }

    // If user is a mentor, create mentor profile
    if (userType === 'mentor') {
      const mentor = new Mentor({
        user: user._id,
        title: 'New Mentor',
        company: 'Not specified',
        experience: 'Not specified',
        domain: 'Not specified',
        skills: [],
        achievements: [],
        availability: []
      });

      await mentor.save();
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user._id, 
            name, 
            email, 
            userType,
            isEmailVerified: false 
          },
          message: 'Registration successful. Please check your email to verify your account.'
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user type matches
    if (user.userType !== userType) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user._id,
        userType: user.userType
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({ 
          token, 
          user: { 
            id: user._id, 
            name: user.name, 
            email: user.email, 
            userType: user.userType,
            isEmailVerified: user.isEmailVerified
          } 
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = generateVerificationToken();
    
    // Save reset token and expiry
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(email, resetToken);
    
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Error sending password reset email' });
  }
});

// @route   POST api/auth/reset-password/:token
// @desc    Reset password
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
});

export default router;