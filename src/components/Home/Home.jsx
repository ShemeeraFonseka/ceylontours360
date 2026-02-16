import React, { useEffect, useState } from 'react'
import './Home.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const Home = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [carouselImages, setCarouselImages] = useState([]);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [homeInfo, setHomeInfo] = useState({
    topic: '',
    line: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeInfo = async () => {
      try {
        const res = await axios.get(`${API_URL}/vipapi/home`);
        setHomeInfo(res.data);
        
        if (res.data.carouselImages && res.data.carouselImages.length > 0) {
          setCarouselImages(res.data.carouselImages.map(
            img => `${API_URL}/vipapi/images/${img}`
          ));
        } else {
          setCarouselImages([
            '/images/slide1.jpg',
            '/images/slide2.jpg',
            '/images/slide3.jpg',
            '/images/ab2.jpg',
            '/images/image6.jpg',
            '/images/image3.jpg',
            '/images/image5.jpg'
          ]);
        }
      } catch (err) {
        console.error("❌ Error fetching home info:", err);
        setCarouselImages([
          '/images/slide1.jpg',
          '/images/slide2.jpg',
          '/images/slide3.jpg'
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeInfo();
  }, [API_URL]);

  useEffect(() => {
    if (carouselImages.length > 0 && isAutoPlaying) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [carouselImages, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % carouselImages.length
    );
  };

  const navigatePackages = () => {
    navigate('/packages');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div 
      className="home-container"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Carousel Background Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
          style={{ backgroundImage: `url(${image})` }}
        />
      ))}

      {/* Overlay */}
      <div className="carousel-overlay" />

      {/* Navigation Arrows */}
      <button 
        className="carousel-arrow carousel-arrow-left" 
        onClick={goToPrevious}
        aria-label="Previous slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <button 
        className="carousel-arrow carousel-arrow-right" 
        onClick={goToNext}
        aria-label="Next slide"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Hero Content */}
      <div className="hero-content">
        <h1>{homeInfo.topic || 'Welcome to VIP Tours'}</h1>
        <p>{homeInfo.line || 'Discover amazing destinations'}</p>
        <button className="hero-btn" onClick={navigatePackages}>
          Explore Packages
        </button>
      </div>

      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;