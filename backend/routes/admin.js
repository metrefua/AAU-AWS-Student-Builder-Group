const express = require('express');
const { body, param, query } = require('express-validator');
const checkJwt = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Apply authentication and admin middleware to all routes
router.use(checkJwt);
router.use(requireAdmin);

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);

// User management routes
router.get('/users', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'admin']).withMessage('Role must be either user or admin')
], adminController.getAllUsers);

router.get('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], adminController.getUserById);

router.put('/users/:id/role', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin')
], adminController.updateUserRole);

router.delete('/users/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], adminController.deleteUser);

// Event management routes
router.post('/events', adminController.createEvent);

router.get('/events', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['workshop', 'meetup', 'hackathon', 'webinar', 'conference', 'other']).withMessage('Invalid event type'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], adminController.getAllEvents);

router.get('/events/:id', [
  param('id').isMongoId().withMessage('Invalid event ID')
], adminController.getEventById);

router.put('/events/:id', [
  param('id').isMongoId().withMessage('Invalid event ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Event title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Event description must be between 10 and 1000 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Event date must be a valid date'),
  body('time')
    .optional()
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Event time must be in HH:MM format'),
  body('location')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Event location must be between 1 and 200 characters'),
  body('type')
    .optional()
    .isIn(['workshop', 'meetup', 'hackathon', 'webinar', 'conference', 'other'])
    .withMessage('Event type must be one of: workshop, meetup, hackathon, webinar, conference, other'),
  body('maxAttendees')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Maximum attendees must be a positive integer'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL'),
  body('registrationLink')
    .optional()
    .isURL()
    .withMessage('Registration link must be a valid URL')
], adminController.updateEvent);

router.delete('/events/:id', [
  param('id').isMongoId().withMessage('Invalid event ID')
], adminController.deleteEvent);

module.exports = router; 