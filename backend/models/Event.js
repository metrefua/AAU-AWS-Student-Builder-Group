const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    minlength: [1, 'Event title must be at least 3 characters long'],
    maxlength: [100, 'Event title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    minlength: [1, 'Event description must be at least 10 characters long'],
    maxlength: [1000, 'Event description cannot be more than 1000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Event location cannot be more than 200 characters']
  },
  type: {
    type: String,
    enum: ['workshop', 'meetup', 'hackathon', 'webinar', 'conference', 'other'],
    default: 'meetup'
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1'],
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  registrationLink: {
    type: String,
    default: null
  },
  meetupLink: {
    type: String,
    default: null
  },
  imageUrl: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
eventSchema.index({ date: 1, isActive: 1 });
eventSchema.index({ createdBy: 1 });

// Virtual for checking if event is in the future
eventSchema.virtual('isUpcoming').get(function() {
  const now = new Date();
  const eventDateTime = new Date(this.date);
  eventDateTime.setHours(parseInt(this.time.split(':')[0]), parseInt(this.time.split(':')[1]));
  return eventDateTime > now;
});

// Method to get formatted date
eventSchema.methods.getFormattedDate = function() {
  return this.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Method to get formatted time
eventSchema.methods.getFormattedTime = function() {
  const [hours, minutes] = this.time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 