import { useState, useEffect, useRef } from 'react';
import './styles/Landing.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCloudArrowUp, HiOutlineAcademicCap, HiOutlineBookOpen } from 'react-icons/hi2';
import { FaBullseye, FaLaptopCode, FaCloud, FaArrowRight } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SocialLinks from '../components/SocialLinks';
import { publicAxios } from '../utils/axios';

// Temporary fallback so the site always has at least one event to show
// while the Meetup -> Backend -> Database pipeline is being connected.
// Once the backend returns real events, this is never used - remove it
// once the database is seeded with live events.
const FALLBACK_EVENTS = [
  {
    _id: 'fallback-aws-meetup-2026-08-15',
    title: 'AWS Student Builder Group Meetup',
    description: 'Join us for our upcoming community meetup - connect with fellow cloud enthusiasts, hear lightning talks, and get updates on certification study groups.',
    date: '2026-08-15',
    time: '17:00',
    location: 'Addis Ababa University, Computer Science Building',
    type: 'meetup',
    registrationLink: 'https://www.meetup.com/aws-cloud-club-at-addis-ababa-university/',
    meetupLink: 'https://www.meetup.com/aws-cloud-club-at-addis-ababa-university/',
    imageUrl: null
  }
];

function Landing({ theme, toggleTheme }) {
  const [activeSection, setActiveSection] = useState('home');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingDemoEvents, setUsingDemoEvents] = useState(false);
  const sectionsRef = useRef({});
  const navigate = useNavigate();
  
  // Fetch events for the landing page
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);        
        const response = await publicAxios.get('/events/public?limit=6');
        
        // Axios automatically throws errors for non-2xx status codes
        // If we reach here, the request was successful
        const fetchedEvents = response.data.events || [];
        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
          setUsingDemoEvents(false);
        } else {
          setEvents(FALLBACK_EVENTS);
          setUsingDemoEvents(true);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        // Backend/database not reachable - show a clearly labeled sample
        // event instead of an empty section or, worse, unlabeled fake data.
        setEvents(FALLBACK_EVENTS);
        setUsingDemoEvents(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Intersection Observer for sectionsF
  useEffect(() => {
    const observers = [];
    const sections = ['home', 'about', 'events', 'resources'];
    
    sections.forEach(section => {
      if (sectionsRef.current[section]) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setActiveSection(section);
            }
          },
          { threshold: 0.3 }
        );
        
        observer.observe(sectionsRef.current[section]);
        observers.push(observer);
      }
    });
    
    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // const handleJoinClick = () => {
  //   navigate('/auth');
  // };

   const handleSocialClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getEventTypeLabel = (type) => {
    const typeLabels = {
      workshop: 'Workshop',
      meetup: 'Meetup',
      hackathon: 'Hackathon',
      webinar: 'Webinar',
      conference: 'Conference',
      other: 'Other'
    };
    return typeLabels[type] || type;
  };

  return (
    <div className="landing-container">
      <Navbar 
        theme={theme} 
        toggleTheme={toggleTheme} 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
        themeIcon={theme === 'light' ? "/dark.svg" : "/light.svg"}
      />
      
      <section id="home" className="hero-section" ref={el => sectionsRef.current.home = el}>
        <div className="hero-backdrop"></div>
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="hero-logo-container"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img 
              src={theme === 'light' ? "/aws-aau-dark.svg" : "/aws-aau-light.svg"} 
              alt="AWS Student Builder Group Icon" 
              className="hero-logo" 
            />
            <img
              src={theme === 'light' ? "/sbg-wordmark-navy.svg" : "/sbg-wordmark-white.svg"}
              alt="AWS Student Builder Group"
              className="hero-wordmark"
            />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span 
              className="gradient-text animated-text"
              style={{
                position: 'relative',
                padding: '0 10px',
                display: 'inline-block'
              }}
            >
              Building The Future
              <span className="text-line-animation"></span>
            </span> with Cloud Computing
          </motion.h2>
          
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Join a community of cloud enthusiasts learning, building, and innovating together
          </motion.p>
          
          <motion.div 
            className="cta-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <button
  className="cta-primary"
  onClick={() =>
    handleSocialClick("https://www.meetup.com/aws-cloud-club-at-addis-ababa-university/")
  }
>
  Join the Group
</button>

            <button className="cta-secondary" onClick={() => scrollToSection('about')}>
              Learn More
            </button>
          </motion.div>
          
          <motion.div 
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onClick={() => scrollToSection('about')}
          >
            <span>Scroll</span>
            <div className="scroll-arrow"></div>
          </motion.div>
        </motion.div>
      </section>

      <section id="about" className="about-section" ref={el => sectionsRef.current.about = el}>
        <div className="section-header">
          <h2>About Our Group</h2>
          <div className="section-divider">
            <span></span>
            <div className="divider-icon">☁️</div>
            <span></span>
          </div>
        </div>
        
        <div className="about-content">
          <motion.div 
            className="about-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="about-card-icon">
              <FaBullseye />
            </div>
            <h3>Our Mission</h3>
            <p>To empower Addis Ababa University students with AWS cloud skills, foster innovation, and connect members with industry opportunities.</p>
          </motion.div>
          
          <motion.div 
            className="about-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="about-card-icon">
              <FaLaptopCode />
            </div>
            <h3>What We Do</h3>
            <p>We organize workshops, real world open-source project contributions, certification study groups, hackathons, and networking events with industry professionals.</p>
          </motion.div>
          
          <motion.div 
            className="about-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="about-card-icon">
              <FaCloud />
            </div>
            <h3>Why AWS?</h3>
            <p>AWS leads cloud computing worldwide. Skills in AWS are highly sought after, offering students a competitive advantage in the job market. Open source projects are available for all students looking for a boost in their resume.</p>
          </motion.div>
        </div>
        
        <motion.div 
          className="stats-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="stat-item">
            <span className="stat-number">250+</span>
            <span className="stat-label">Group Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">6+</span>
            <span className="stat-label">Events Per Year</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">FREE</span>
            <span className="stat-label">Chances for Certifications</span>
          </div>
        </motion.div>
      </section>

      <section id="events" className="events-section" ref={el => sectionsRef.current.events = el}>
        <div className="section-header">
          <h2>Upcoming Events</h2>
          <div className="section-divider">
            <span></span>
            <div className="divider-icon">📅</div>
            <span></span>
          </div>
        </div>
        
        {loading ? (
          <motion.div 
            className="loading-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{
              textAlign: 'center',
              padding: '50px 20px',
              fontSize: '1.2rem',
              color: 'var(--text-secondary)'
            }}
          >
            <div className="loading-spinner" style={{ 
              width: '50px', 
              height: '50px', 
              border: '4px solid var(--border-color)', 
              borderTop: '4px solid var(--accent)', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 20px'
            }}></div>
            <p>Loading events...</p>
          </motion.div>
        ) : events.length > 0 ? (
          <>
          {usingDemoEvents && (
            <p className="events-demo-note">
              Showing a sample event — live events will appear here automatically once synced.
            </p>
          )}
          <motion.div 
            className="events-container"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {events.map((event, index) => (
              <motion.div 
                key={event._id}
                className="event-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="event-date-badge">
                  <div className="event-month">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="event-day">
                    {new Date(event.date).getDate()}
                  </div>
                </div>
                <div className="event-content">
                  {event.imageUrl && (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="event-image"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  )}
                  <div className="event-title-row">
                    <h3>{event.title}</h3>
                    <div className="event-badges">
                      {usingDemoEvents && <span className="event-demo-badge">Sample</span>}
                      <span className={`event-type-badge event-type-${event.type || 'other'}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                  <div className="event-details">
                    <span>📅 {formatDate(event.date)}</span>
                    <span>🕒 {formatTime(event.time)}</span>
                    <span>📍 {event.location}</span>
                    {event.maxAttendees && (
                      <span>👥 Max: {event.maxAttendees}</span>
                    )}
                  </div>
                  <p>{event.description}</p>
                  <div className="event-actions-row">
                    {event.registrationLink && (
                      <a 
                        href={event.registrationLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="event-button"
                      >
                        Register Now
                      </a>
                    )}
                    {event.meetupLink && event.meetupLink !== event.registrationLink && (
                      <a 
                        href={event.meetupLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="event-link-secondary"
                      >
                        View on Meetup
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
          </>
        ) : (
          <motion.div 
            className="no-events-message"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            style={{
              textAlign: 'center',
              padding: '50px 20px',
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              fontStyle: 'italic'
            }}
          >
            <div className="no-events-icon" style={{ fontSize: '3rem', marginBottom: '20px' }}>
              🗓️
            </div>
            <h3>Nothing to see here yet</h3>
            <p>Stay tuned for our upcoming events!</p>
          </motion.div>
        )}
        
        <motion.div 
          className="view-all-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.1 }}
        >
          <button
            className="view-all-button"
            onClick={() => handleSocialClick('https://www.meetup.com/aws-cloud-club-at-addis-ababa-university/events/')}
          >
            View All Events
          </button>
        </motion.div>
      </section>

      <section id="resources" className="resources-section" ref={el => sectionsRef.current.resources = el}>
        <div className="section-header">
          <h2>Group Resources</h2>
          <div className="section-divider">
            <span></span>
            <div className="divider-icon">🔗</div>
            <span></span>
          </div>
        </div>
        
        <div className="resources-container">
          <motion.div 
            className="resource-card"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={() => window.open('https://aws.amazon.com/free/', '_blank', 'noopener,noreferrer')}
            style={{ cursor: 'pointer' }}
          >
            <div className="resource-icon">
              <HiOutlineCloudArrowUp />
            </div>
            <h3>AWS Free Tier Access</h3>
            <p>Get started with AWS services at no cost through our educational partnership.</p>
            <a href="https://aws.amazon.com/free/" target="_blank" rel="noopener noreferrer" className="resource-link">Access Now <FaArrowRight aria-hidden="true" /></a>
          </motion.div>
          
          <motion.div 
            className="resource-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={() => navigate('/certifications')}
            style={{ cursor: 'pointer' }}
          >
            <div className="resource-icon">
              <HiOutlineAcademicCap />
            </div>
            <h3>Certification Vouchers</h3>
            <p>Active members may qualify for discounted AWS certification exam vouchers.</p>
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/certifications'); }} className="resource-link">Learn More <FaArrowRight aria-hidden="true" /></a>
          </motion.div>
          
          <motion.div 
            className="resource-card"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true, amount: 0.3 }}
            onClick={() => navigate('/resources')}
            style={{ cursor: 'pointer' }}
          >
            <div className="resource-icon">
              <HiOutlineBookOpen />
            </div>
            <h3>Learning Materials</h3>
            <p>Access our curated collection of guides, tutorials, and practice exercises.</p>
            <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/resources'); }} className="resource-link">Browse Library <FaArrowRight aria-hidden="true" /></a>
          </motion.div>
        </div>
        
        <motion.div 
          className="testimonials-container"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3>What Our Members Say</h3>
          <div className="testimonials-slider">
            <div className="testimonial">
              <p>"The AWS Student Builder Group helped me land my dream job as a cloud engineer. The certification prep and hands-on labs were invaluable."</p>
              <div className="testimonial-author">
                <img src="/avatar.svg" alt="Jane Doe" />
                <div>
                  <strong>Ephraim Debel</strong>
                  <span>Software Engineer</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
      
      <section className="cta-section">
        <motion.div 
          className="cta-card"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.5 }}
        >
          <h2>Ready to start your cloud journey?</h2>
          <p>Join our community today and get access to workshops, networking events, and resources to accelerate your career.</p>
          <button className="join-button" onClick={() =>
    handleSocialClick("https://www.meetup.com/aws-cloud-club-at-addis-ababa-university/")
  }>
            Join the Group
          </button>

        </motion.div>
      </section>
      <SocialLinks />

      <Footer theme={theme} />
    </div>
  );
}

export default Landing;
