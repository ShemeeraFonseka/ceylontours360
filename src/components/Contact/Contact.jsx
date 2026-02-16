import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css'
import { FaWhatsapp } from "react-icons/fa";

const Contact = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [contactInfo, setContactInfo] = useState({
    mobile: '',
    email: '',
    whatsapp: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/vipapi/contact-info`);
        setContactInfo(res.data);
      } catch (err) {
        console.error("❌ Error fetching contact info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, [API_URL]);

  // Function to handle WhatsApp click
  const handleWhatsAppClick = () => {
    if (contactInfo.whatsapp) {
      // Remove any spaces, dashes, or special characters except +
      const cleanNumber = contactInfo.whatsapp.replace(/[^\d+]/g, '');
      // Open WhatsApp with the number
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  return (
    <section className="contactus-section">
      <h2>Contact Us</h2>
      
      {/* Display image from database or fallback to default */}
      <div className="contactus-image">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <img 
            src={contactInfo.image 
              ? `${API_URL}/vipapi/images/${contactInfo.image}` 
              : '/images/image.jpg'
            } 
            alt="Contact" 
          />
        )}
      </div>

      <div className="contactus-container">
        {/* Middle: Contact Details */}
        <div className="contactus-details">
          <br />
          <h3>Get in Touch</h3>
          <p>We're here to help you plan the perfect trip!</p>

          <div className="detail-item">
            <span>📞</span>
            <p>{loading ? 'Loading...' : (contactInfo.mobile || 'Not available')}</p>
          </div>

          <div 
            className="detail-item whatsapp-clickable" 
            onClick={handleWhatsAppClick}
            style={{ cursor: 'pointer' }}
            title="Click to open WhatsApp"
          >
            <span><FaWhatsapp style={{ color: '#25D366'}}/></span>
            <p >
              {loading ? 'Loading...' : (contactInfo.whatsapp || 'Not available')}
            </p>
          </div>

          <div className="detail-item">
            <span>✉️</span>
            <p>{loading ? 'Loading...' : (contactInfo.email || 'Not available')}</p>
          </div>
        </div>

        {/* Right: Contact Form */}
        <form className="contactus-form">
          <h3>Send Us a Message</h3>

          <input type="text" placeholder="Your Name" required />
          <input type="email" placeholder="Your Email" required />
          <textarea placeholder="Your Message" rows="5" required></textarea>

          <button type="submit" className="send-btn">Send Message</button>
        </form>
      </div>
    </section>
  );
};

export default Contact;