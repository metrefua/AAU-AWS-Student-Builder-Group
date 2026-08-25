const Newsletter = require('../models/Newsletter');
const validator = require('validator');
const mongoose = require('mongoose');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  try {
    const { email, message } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    if (message && message.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be more than 1000 characters'
      });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const trimmedMessage = message ? message.trim() : '';

    // If this email already subscribed, treat a new submission with a
    // message as an update (e.g. contact/feedback form) rather than an error.
    const existing = await Newsletter.findOne({ email: normalizedEmail });
    if (existing) {
      if (trimmedMessage) {
        existing.message = trimmedMessage;
        await existing.save();
        return res.status(200).json({
          success: true,
          message: 'Thanks! Your message has been received.'
        });
      }

      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    const newSubscription = new Newsletter({ email: normalizedEmail, message: trimmedMessage });
    await newSubscription.save();

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter! Thank you for joining us.'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed to our newsletter'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};

const getSubscriptions = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        message: 'Service temporarily unavailable. Please try again later.'
      });
    }

    const subscriptions = await Newsletter.find({})
      .select('email subscribedAt')
      .sort({ subscribedAt: -1 });

    res.status(200).json({
      success: true,
      data: subscriptions,
      count: subscriptions.length
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving subscriptions'
    });
  }
};

module.exports = {
  subscribe,
  getSubscriptions
};
