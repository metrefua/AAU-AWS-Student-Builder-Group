const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
require('dotenv').config();

const connectDB = require('../config/database');

const createSampleEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Find an admin user to be the creator
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Sample events data
    const sampleEvents = [
      {
        title: 'AWS Cloud Practitioner Workshop',
        description: 'Join us for a hands-on workshop to learn the fundamentals of AWS Cloud Practitioner certification. We\'ll cover core AWS services, security, and best practices.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        time: '14:00',
        location: 'Computer Science Building, Room 301',
        type: 'workshop',
        maxAttendees: 30,
        isActive: true,
        registrationLink: 'https://forms.google.com/sample1'
      },
      {
        title: 'Cloud Computing Meetup',
        description: 'Monthly meetup for cloud enthusiasts. Network with fellow students, share experiences, and learn about the latest in cloud technology.',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        time: '18:00',
        location: 'Student Center, Conference Room A',
        type: 'meetup',
        maxAttendees: 50,
        isActive: true,
        registrationLink: 'https://forms.google.com/sample2'
      },
      {
        title: 'AWS Hackathon 2024',
        description: 'Build innovative solutions using AWS services! 24-hour hackathon with prizes, mentorship, and networking opportunities.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        time: '09:00',
        location: 'Engineering Building, Lab 205',
        type: 'hackathon',
        maxAttendees: 100,
        isActive: true,
        registrationLink: 'https://forms.google.com/sample3'
      },
      {
        title: 'AWS Solutions Architect Webinar',
        description: 'Learn about AWS Solutions Architect certification path. Expert-led session covering exam preparation and real-world scenarios.',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        time: '16:00',
        location: 'Online (Zoom)',
        type: 'webinar',
        maxAttendees: 200,
        isActive: true,
        registrationLink: 'https://zoom.us/sample4'
      },
      {
        title: 'Cloud Career Fair',
        description: 'Connect with top tech companies hiring cloud professionals. Resume reviews, mock interviews, and networking sessions.',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000), // 28 days from now
        time: '10:00',
        location: 'Main Auditorium',
        type: 'conference',
        maxAttendees: 150,
        isActive: true,
        registrationLink: 'https://forms.google.com/sample5'
      }
    ];

    // Create events
    for (const eventData of sampleEvents) {
      const event = new Event({
        ...eventData,
        createdBy: adminUser._id
      });
      
      await event.save();
      console.log(`Created event: ${event.title}`);
    }

    console.log('✅ Sample events created successfully!');
    console.log(`Total events created: ${sampleEvents.length}`);
    
    // Verify events were created
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ isActive: true });
    const upcomingEvents = await Event.countDocuments({ 
      isActive: true, 
      date: { $gte: new Date() } 
    });
    
    console.log(`Total events in database: ${totalEvents}`);
    console.log(`Active events: ${activeEvents}`);
    console.log(`Upcoming events: ${upcomingEvents}`);

    process.exit(0);
  } catch (error) {
    console.error('Error creating sample events:', error);
    process.exit(1);
  }
};

createSampleEvents(); 