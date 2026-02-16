import React, { useState, useEffect ,useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PackageDetail.css';

const PackageDetail = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    countryCode: '+94',
    phone: '',
    email: '',
    address: '',
    checkin: '',
    checkout: '',
    destination: '',
    price: '',
    adults: '',
    children: '',
    request: ''
  });

  // Common country codes
  const countryCodes = [
    { code: '+1', country: 'USA/Canada' },
    { code: '+44', country: 'UK' },
    { code: '+61', country: 'Australia' },
    { code: '+81', country: 'Japan' },
    { code: '+86', country: 'China' },
    { code: '+91', country: 'India' },
    { code: '+94', country: 'Sri Lanka' },
    { code: '+95', country: 'Myanmar' },
    { code: '+977', country: 'Nepal' },
    { code: '+880', country: 'Bangladesh' },
    { code: '+92', country: 'Pakistan' },
    { code: '+60', country: 'Malaysia' },
    { code: '+65', country: 'Singapore' },
    { code: '+66', country: 'Thailand' },
    { code: '+84', country: 'Vietnam' },
    { code: '+62', country: 'Indonesia' },
    { code: '+63', country: 'Philippines' },
    { code: '+82', country: 'South Korea' },
    { code: '+852', country: 'Hong Kong' },
    { code: '+971', country: 'UAE' },
    { code: '+966', country: 'Saudi Arabia' },
    { code: '+27', country: 'South Africa' },
    { code: '+33', country: 'France' },
    { code: '+49', country: 'Germany' },
    { code: '+39', country: 'Italy' },
    { code: '+34', country: 'Spain' },
    { code: '+7', country: 'Russia' },
    { code: '+55', country: 'Brazil' },
    { code: '+52', country: 'Mexico' },
    { code: '+64', country: 'New Zealand' },
  ].sort((a, b) => a.country.localeCompare(b.country));

  const fetchPackageDetail = useCallback(async () => {
  try {
    const res = await axios.get(`${API_URL}/vipapi/packages/${packageId}`);
    setPackageData(res.data);

    setBookingFormData(prev => ({
      ...prev,
      destination: res.data.title
    }));
  } catch (err) {
    console.error("❌ Error fetching package details:", err);
    setError("Package not found");
  } finally {
    setLoading(false);
  }
}, [API_URL, packageId]);

useEffect(() => {
  fetchPackageDetail();
}, [fetchPackageDetail]);

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!bookingFormData.name || !bookingFormData.phone || !bookingFormData.email ||
        !bookingFormData.checkin || !bookingFormData.checkout) {
        alert('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Validate dates
      const checkinDate = new Date(bookingFormData.checkin);
      const checkoutDate = new Date(bookingFormData.checkout);

      if (checkoutDate <= checkinDate) {
        alert('Check-out date must be after check-in date');
        setSubmitting(false);
        return;
      }


      // Send booking request
      const response = await axios.post(
        `${API_URL}/vipapi/bookings`,
        bookingFormData
      );

      alert(`✅ Booking created successfully! Booking ID: ${response.data.bookingID}`);

      // Reset form
      setBookingFormData({
        name: '',
        countryCode: '+94',
        phone: '',
        email: '',
        address: '',
        checkin: '',
        checkout: '',
        price: '',
        destination: packageData.title,
        adults: 1,
        children: 0,
        request: ''
      });
    } catch (err) {
      console.error('❌ Error creating booking:', err);
      const errorMsg = err.response?.data?.error || 'Failed to create booking. Please try again.';
      alert(`Error: ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="package-detail-container">
        <div className="loading-spinner">
          <p>Loading package details...</p>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="package-detail-container">
        <div className="error-message">
          <h2>Package Not Found</h2>
          <p>The package you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/packages')} className="back-btn">
            Back to Packages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-container">
      {/* Hero Section */}
      <div className="package-hero">
        <img
          src={`${API_URL}${packageData.image}`}
          alt={packageData.title}
          className="hero-image"
        />
        <div className="hero-overlay">
          <h1>{packageData.title}</h1>
          <p>{packageData.description}</p>

        </div>
      </div>

      {/* Main Content */}
      <div className="package-content">
        <button onClick={() => navigate(-1)} className="back-link">
          ← Back to Packages
        </button>

        {/* Detailed Introduction */}
        {packageData.detailedTitle && (
          <div className="detail-intro">
            <h2>{packageData.detailedTitle}</h2>
            {packageData.detailedIntro && (
              <p className="intro-text">{packageData.detailedIntro}</p>
            )}
          </div>
        )}

        {/* Sections */}
        {packageData.sections && packageData.sections.length > 0 && (
          <div className="detail-sections">
            {packageData.sections.map((section, index) => (
              <div key={index} className="detail-section">
                <h3>{section.sectionTitle}</h3>
                {section.sectionImage && (
                  <img
                    src={`${API_URL}/${section.sectionImage}`}
                    alt={section.sectionTitle}
                    className="section-image"
                  />
                )}
                <p className="section-content">{section.sectionContent}</p>

              </div>

            ))}
          </div>
        )}

        <div className="pro-tip">
          <h1>USD {packageData.price}</h1>


        </div>

        <br /><br />
        {/* Pro Tip */}
        {packageData.proTip && (
          <div className="pro-tip">

            <h3>💡 Pro Tip for Travelers:</h3>
            <p>{packageData.proTip}</p>
          </div>
        )}

        {/* Booking Form */}
        <div className="booking-section">
          <h2>Book Your Tour</h2>
          <p>Please fill out the form and we will contact you shortly.</p>

          <form className="booking-form" onSubmit={handleBookingSubmit}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Name *"
                value={bookingFormData.name}
                onChange={handleBookingInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail *"
                value={bookingFormData.email}
                onChange={handleBookingInputChange}
                required
              />
            </div>

            <div className="form-group phone-group">
              <select
                name="countryCode"
                value={bookingFormData.countryCode}
                onChange={handleBookingInputChange}
                className="country-code-select"
                required
              >
                {countryCodes.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.code} ({item.country})
                  </option>
                ))}
              </select>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={bookingFormData.phone}
                onChange={handleBookingInputChange}
                pattern="[0-9]{7,15}"
                title="Please enter a valid phone number (7-15 digits)"
                required
              />
            </div>

            <div className="form-group">
              <input
                type="text"
                name="destination"
                placeholder="Destination *"
                value={bookingFormData.destination}
                onChange={handleBookingInputChange}
                readOnly
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={bookingFormData.address}
                onChange={handleBookingInputChange}
              />
            </div>

            <div className="form-group">
              <input
                type="date"
                name="checkin"
                placeholder="Check-in *"
                value={bookingFormData.checkin}
                onChange={handleBookingInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <input
                type="date"
                name="checkout"
                placeholder="Check-out *"
                value={bookingFormData.checkout}
                onChange={handleBookingInputChange}
                min={bookingFormData.checkin || new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="number"
                name="adults"
                placeholder="Adults *"
                value={bookingFormData.adults}
                onChange={handleBookingInputChange}
                min="1"
                required
              />
              <input
                type="number"
                name="children"
                placeholder="Children"
                value={bookingFormData.children}
                onChange={handleBookingInputChange}
                min="0"
              />
            </div>

            

            <textarea
              name="request"
              placeholder="Your Message / Special Requests"
              value={bookingFormData.request}
              onChange={handleBookingInputChange}
            />

            <button
              type="submit"
              className="book-now-btn"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </form>
        </div>

        <br /><br />

        {/* Call to Action */}
        <div className="detail-cta">
          <h3>Ready to Explore?</h3>
          <p>Contact us to customize this tour to your preferences</p>
          <button onClick={() => navigate('/contact')} className="contact-cta-btn">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;