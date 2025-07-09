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

router.put('/events/:id', adminController.updateEvent);

router.delete('/events/:id', [
  param('id').isMongoId().withMessage('Invalid event ID')
], adminController.deleteEvent);

module.exports = router; 