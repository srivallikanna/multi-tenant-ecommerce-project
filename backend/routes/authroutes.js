import express from 'express';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/user.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }
    return res.status(200).json({
      message: 'Login Successful',
      token: 'sample_token_123',
      userId: user._id,
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during login' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const newUser = new User({ name, email, password });
    await newUser.save();
    return res.status(201).json({ message: 'Account Created Successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error during signup' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const hostHeader = req.headers.host || 'localhost:5000';
    const hostName = hostHeader.split(':')[0];
    const resetLink = `http://10.143.162.42:5173/reset-password?token=${resetToken}&email=${email}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"MultiTenant Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - MultiTenant Store',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px; margin: 0 auto; color: #1e293b;">
          <h2 style="color: #4f46e5; margin-top: 0;">MultiTenant Store</h2>
          <p style="font-size: 14px; line-height: 1.5;">Hello,</p>
          <p style="font-size: 14px; line-height: 1.5;">We received a request to reset your password for your MultiTenant Store account.</p>
          <p style="font-size: 14px; line-height: 1.5;">Click the button below to choose a new password:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetLink}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b; margin-top: 20px;">If you did not request this password reset, please ignore this email. This link is valid for 1 hour.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Password reset link sent to your email successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ message: 'Failed to send email. Please try again.' });
  }
});

export default router;