const User = require('../models/User');
const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// User Management Controllers
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const role = req.query.role || '';

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      error: 'Server error while fetching users'
    });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      error: 'Server error while fetching user'
    });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    const userId = req.params.id;

    // Prevent admin from removing their own admin role
    if (userId === req.adminUser._id.toString() && role !== 'admin') {
      return res.status(400).json({
        error: 'Cannot remove admin role from yourself'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password -resetPasswordToken -resetPasswordExpires');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      error: 'Server error while updating user role'
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (userId === req.adminUser._id.toString()) {
      return res.status(400).json({
        error: 'Cannot delete your own account'
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      error: 'Server error while deleting user'
    });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get upcoming events
    const upcomingEvents = await Event.countDocuments({
      date: { $gte: new Date() },
      isActive: true
    });

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalEvents,
        activeEvents,
        recentRegistrations,
        upcomingEvents
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      error: 'Server error while fetching dashboard stats'
    });
  }
};

// Event Management Controllers
exports.createEvent = async (req, res) => {
  console.log(req.body)
  try {

    const eventData = {
      ...req.body,
      createdBy: req.adminUser._id
    };

    const event = new Event(eventData);
    await event.save();

    await event.populate('createdBy', 'fullName username');

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      error: 'Server error while creating event'
    });
  }
};
exports.getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const type = req.query.type || '';
    const isActive = req.query.isActive;

    const skip = (page - 1) * limit;

    // Build query
    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    if (type) {
      query.type = type;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const events = await Event.find(query)
      .populate('createdBy', 'fullName username')
      .populate('attendees.user', 'fullName username profilePicture')
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      events,
      pagination: {
        currentPage: page,
        totalPages,
        totalEvents: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({
      error: 'Server error while fetching events'
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'fullName username')
      .populate('attendees.user', 'fullName username profilePicture');

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    res.json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      error: 'Server error while fetching event'
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'fullName username')
    .populate('attendees.user', 'fullName username profilePicture');

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    res.json({
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      error: 'Server error while updating event'
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    res.json({
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      error: 'Server error while deleting event'
    });
  }
};

// Public Events Controller (for landing page)
exports.getPublicEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6; // Show 6 events on landing page
    const currentDate = new Date();
    
    // Set current date to start of day for better comparison
    currentDate.setHours(0, 0, 0, 0);

    console.log('Fetching public events with current date:', currentDate);

    // TEMPORARY: Get all active events (for debugging)
    const events = await Event.find({
      isActive: true
    })
    .populate('createdBy', 'fullName username')
    .sort({ date: 1 })
    .limit(limit);

    // console.log(`Found ${events.length} public events`);
    // console.log('Event dates:', events.map(e => ({ title: e.title, date: e.date, isActive: e.isActive })));

    res.json({
      events,
      totalEvents: events.length
    });
  } catch (error) {
    console.error('Get public events error:', error);
    res.status(500).json({
      error: 'Server error while fetching events'
    });
  }
}; 