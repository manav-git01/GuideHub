import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Debug logging
console.log('Email Configuration Check:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set');
console.log('FRONTEND_URL:', process.env.FRONTEND_URL);

// Generate a random token for email verification and password reset
export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Send verification email
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your Email - GuideHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Welcome to GuideHub!</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Please verify your email address to complete your registration.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
          <p style="color: #2c3e50; margin-bottom: 20px;">Click the button below to verify your email:</p>
          
          <div style="text-align: center;">
            <a href="${verificationUrl}" 
               style="display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Verify Email
            </a>
          </div>
        </div>
        
        <div style="color: #7f8c8d; font-size: 14px; text-align: center;">
          <p>This link will expire in 24 hours.</p>
          <p>If you did not create an account, please ignore this email.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request - GuideHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">Password Reset Request</h1>
          <p style="color: #7f8c8d; font-size: 16px;">You requested to reset your password.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
          <p style="color: #2c3e50; margin-bottom: 20px;">Click the button below to reset your password:</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" 
               style="display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Reset Password
            </a>
          </div>
        </div>
        
        <div style="color: #7f8c8d; font-size: 14px; text-align: center;">
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send login notification email
export const sendLoginNotificationEmail = async (email) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'New Login Detected - GuideHub',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2c3e50; margin-bottom: 10px;">New Login Detected</h1>
          <p style="color: #7f8c8d; font-size: 16px;">Your account was just accessed.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 30px;">
          <p style="color: #2c3e50;">If this was you, you can safely ignore this email.</p>
          <p style="color: #2c3e50;">If this wasn't you, please secure your account immediately.</p>
        </div>
        
        <div style="color: #7f8c8d; font-size: 14px; text-align: center;">
          <p>This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export { transporter }; 