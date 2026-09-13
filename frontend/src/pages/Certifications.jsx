import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCertificate, FaServer, FaCode, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import '../pages/styles/Landing.css'; // reuse .resource-card / .section-header styles
import './styles/InfoPage.css';

// Structured so real destination URLs can be added/edited in one place.
const certifications = [
  {
    icon: FaCertificate,
    title: 'AWS Certified Cloud Practitioner',
    description: 'The best starting point for students with no prior cloud background.',
    url: 'https://aws.amazon.com/certification/certified-cloud-practitioner/'
  },
  {
    icon: FaServer,
    title: 'AWS Certified Solutions Architect – Associate',
    description: 'Design available, cost-efficient, fault-tolerant systems on AWS.',
    url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/'
  },
  {
    icon: FaCode,
    title: 'AWS Certified Developer – Associate',
    description: 'For students who build and maintain applications on AWS.',
    url: 'https://aws.amazon.com/certification/certified-developer-associate/'
  },
  {
    icon: FaGraduationCap,
    title: 'AWS Certification Exam Prep',
    description: 'Official practice questions and exam readiness guides for every path.',
    url: 'https://aws.amazon.com/certification/certification-prep/'
  }
];

function Certifications({ theme, toggleTheme }) {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    navigate(`/#${sectionId}`);
  };

  return (
    <div className="info-page-container">
      <Navbar theme={theme} toggleTheme={toggleTheme} scrollToSection={scrollToSection} />

      <div className="info-page-content">
        <motion.button
          className="back-button"
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          ← Back to Home
        </motion.button>

        <div className="section-header">
          <h2>AWS Certifications</h2>
          <div className="section-divider">
            <span></span>
            <div className="divider-icon">🎓</div>
            <span></span>
          </div>
        </div>

        <div className="resources-container">
          {certifications.map((item, i) => {
            const Icon = item.icon;
            return (
            <motion.div
              className="resource-card"
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
              style={{ cursor: 'pointer' }}
            >
              <div className="resource-icon">
                <Icon aria-hidden="true" />
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="resource-link" onClick={(e) => e.stopPropagation()}>
                Access Now <FaArrowRight aria-hidden="true" />
              </a>
            </motion.div>
            );
          })}
        </div>
      </div>

      <Footer theme={theme} />
    </div>
  );
}

export default Certifications;
