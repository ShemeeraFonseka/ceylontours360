import React from 'react'
import './BookSection.css'
import { useNavigate } from 'react-router-dom'


const BookSection = () => {
  const navigate = useNavigate();
  const navigatePackages = () => {
    navigate('/packages');
  };

  return (
    <section className="book-section">
      <div className="book-overlay">
        <div className="book-content">
          <h2>Ready to Start Your Adventure?</h2>
          <p>
            Experience Sri Lanka like never before — from stunning beaches to ancient wonders.
            Your dream vacation is just one click away.
          </p>
          <button className="book-btn" onClick={navigatePackages}>Book Now</button>
        </div>
      </div>
    </section>
  )
}

export default BookSection
