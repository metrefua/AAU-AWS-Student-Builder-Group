import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineMail } from 'react-icons/hi';
import { newsletterAPI } from '../utils/api';
import './styles/Footer.css';

function Footer({ theme }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' }); // type: 'success', 'error', ''

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setMessage({ text: 'Please enter your email address', type: 'error' });
      return;
    }

    if (!isValidEmail(email.trim())) {
      setMessage({ text: 'Please enter a valid email address', type: 'error' });
      return;
    }

    if (messageText.length > 1000) {
      setMessage({ text: 'Message must be 1000 characters or fewer', type: 'error' });
      return;
    }

    setIsLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await newsletterAPI.subscribe(email.trim(), messageText.trim());
      
      if (response.success) {
        setMessage({ text: response.message, type: 'success' });
        setEmail(''); // Clear the inputs on success
        setMessageText('');
      } else {
        setMessage({ text: response.message || 'Something went wrong', type: 'error' });
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage({ 
        text: error.message || 'Unable to subscribe. Please try again later.',
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }
  };

  return (
    <footer className="landing-footer">
      <div className="footer-content">
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="footer-logo">
            <img src={theme === 'light' ? "/aws-aau-dark.svg" : "/aws-aau-light.svg"} alt="AWS Student Builder Group Logo" className="footer-aws-logo" />
            <h3>AAU AWS Student Builder Group</h3>
          </div>
          <p>Empowering students with cloud computing skills and connecting them to industry opportunities.</p>
        </motion.div>
        
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <h3>Quick Links</h3>
          <ul>
            <li><button type="button" onClick={() => navigate('/#home')}>Home</button></li>
            <li><button type="button" onClick={() => navigate('/#about')}>About Us</button></li>
            <li><button type="button" onClick={() => navigate('/#events')}>Events</button></li>
            <li><button type="button" onClick={() => navigate('/resources')}>Resources</button></li>
          </ul>
        </motion.div>
        
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3>Contact Us</h3>
          <div className="contact-info">
            <HiOutlineMail aria-hidden="true" />
            <a href="mailto:awscloudclubs@aau.edu">awscloudclubs@aau.edu</a>
          </div>
        </motion.div>
        
        <motion.div 
          className="footer-section"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3>Newsletter</h3>
          <p>Stay updated with our latest events and opportunities, or send us a message</p>
          <div className="newsletter">
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input 
                type="email" 
                placeholder="Your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
              <textarea
                className="newsletter-message-input"
                placeholder="Your message (optional)"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                disabled={isLoading}
                maxLength={1000}
                rows={3}
              />
              <motion.button 
                type="submit"
                disabled={isLoading}
                whileHover={!isLoading ? { backgroundColor: 'var(--accent-secondary)' } : {}}
                whileTap={!isLoading ? { scale: 0.95 } : {}}
                style={{ 
                  opacity: isLoading ? 0.7 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? 'Sending...' : 'Submit'}
              </motion.button>
            </form>
            {message.text && (
              <motion.div 
                className={`newsletter-message ${message.type}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                role={message.type === 'error' ? 'alert' : 'status'}
              >
                {message.text}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Addis Ababa University AWS Student Builder Group</p>
      </div>
    </footer>
  );
};

export default Footer;
