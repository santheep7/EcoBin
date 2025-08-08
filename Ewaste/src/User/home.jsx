import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Recycle, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './usernavbar';
import Footer from './Footer'
import axios from 'axios'
const heroSlides = [
  {
    title: "Greener Future Together",
    description: "Join our mission to reduce e-waste and create a sustainable future",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
    cta: "Learn More",
    target: "features" // Added target identifier
  },
  {
    title: "E-Waste Dangers",
    description: "Understand the environmental impact of improper e-waste disposal",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e",
    cta: "Watch Video",
    target: "video" // Added target identifier
  },
  {
    title: "How Recycling Works",
    description: "Discover our efficient e-waste recycling process",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    cta: "See Process",
    target: "process" // Added target identifier
  }
];

const stats = [
  { value: 12500, label: 'Devices Recycled' },
  { value: 3200, label: 'Happy Users' },
  { value: 45, label: 'Locations' },
  { value: 98, label: 'Satisfaction Rate', unit: '%' }
];

const features = [
  {
    title: "Easy Scheduling",
    description: "Schedule e-waste pickup with just a few clicks",
    icon: "📅"
  },
  {
    title: "Track Impact",
    description: "See how much e-waste you've diverted from landfills",
    icon: "📊"
  },
  {
    title: "Rewards Program",
    description: "Earn points for recycling that you can redeem",
    icon: "🏆"
  }
];


export default function UserHome() {
  const API_BASE_URL = import.meta.env.API_BASE_URL;
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [showChat, setShowChat] = useState(false);
  const [latestFeedback, setLatestFeedback] = useState(null);

  const [stats, setStats] = useState([
    { value: 0, label: "Devices Recycled" },
    { value: 0, label: "Happy Users" },
    { value: 0, label: "Locations" },
    { value: 0, label: "Satisfaction Rate", unit: "%" },
  ]);
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('name');
  }, []);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [deviceRes, locRes, satRes, nlpRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/req/getrecyclecount`),
          axios.get(`${API_BASE_URL}/api/req/loc`),
          axios.get(`${API_BASE_URL}/api/msg/rate`),
          axios.get(`${API_BASE_URL}/api/msg/gethappy`),
        ]);

        setStats([
          { value: deviceRes.data.count || 0, label: "Devices Recycled" },
          { value: nlpRes.data.happyUsers || 0, label: "Happy Users" },
          { value: locRes.data.count || 0, label: "Locations" },
          { value: satRes.data.percentage || 0, label: "Satisfaction Rate", unit: "%" },
        ]);
      } catch (err) {
        console.error("Error fetching stats", err);
      }
    };

    fetchStats();
  }, []);
  //   const token =localStorage.getItem('token')

  // const isLoggedIn=!!token;

  // Create refs for each section
  const featuresRef = useRef(null);
  const videoRef = useRef(null);
  const processRef = useRef(null);

  const nextHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
  };

  const prevHeroSlide = () => {
    setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  // Function to handle smooth scrolling
  const scrollToSection = (target) => {
    let ref;
    switch (target) {
      case 'features':
        ref = featuresRef;
        break;
      case 'video':
        ref = videoRef;
        break;
      case 'process':
        ref = processRef;
        break;
      default:
        return;
    }

    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };


  return (
    <>
      <Navbar />
      <div className="homepage">
        {/* Hero Carousel */}
        <section className="hero-carousel">
          <div className="hero-slide"
            style={{ backgroundImage: `url(${heroSlides[currentHeroSlide].image})` }}>
            <div className="hero-content">
              <h1>{heroSlides[currentHeroSlide].title}</h1>
              <p>{heroSlides[currentHeroSlide].description}</p>
              <button
                className="cta-button"
                onClick={() => scrollToSection(heroSlides[currentHeroSlide].target)}
              >
                {heroSlides[currentHeroSlide].cta}
              </button>
            </div>
          </div>
          <button className="carousel-nav prev" onClick={prevHeroSlide}>
            <ChevronLeft size={32} />
          </button>
          <button className="carousel-nav next" onClick={nextHeroSlide}>
            <ChevronRight size={32} />
          </button>
          <div className="carousel-dots">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentHeroSlide ? 'active' : ''}`}
                onClick={() => setCurrentHeroSlide(index)}
              />
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section py-6">
          <div className="stats-container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="stat-card bg-white p-6 rounded-lg shadow text-center">
                <h3 className="text-3xl font-bold text-green-600">
                  {stat.value}
                  {stat.unit || ''}
                </h3>
                <p className="text-gray-500 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section" ref={featuresRef}>
          <h2>Why Choose EcoBin?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className="video-section" ref={videoRef}>
          <h2>Learn About E-Waste</h2>
          <div className="video-container">
            <iframe
              width="100%"
              height="500"
              src="https://www.youtube.com/embed/MQLadfsvfLo"
              title="E-Waste Dangers"
              frameBorder="0"
              allowFullScreen>
            </iframe>
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section" ref={processRef}>
          <h2>Our Recycling Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h3>Collection</h3>
              <p>We pick up your e-waste from your location at a scheduled time</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h3>Sorting</h3>
              <p>Items are sorted by material type for proper recycling</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h3>Processing</h3>
              <p>Materials are broken down and prepared for reuse</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h3>Recycling</h3>
              <p>Materials are transformed into new products</p>
            </div>
          </div>
        </section>



        {/* Floating Chat */}
        <div className="floating-chat" onClick={() => setShowChat(!showChat)}>
          💬
        </div>

        <Footer isLoggedIn={false} />

        <style jsx>{`
          /* Global Styles */
          .homepage {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            overflow-x: hidden;
          }
          
          h1, h2, h3 {
            margin: 0;
            font-weight: 600;
          }
          
          /* Hero Carousel */
          .hero-carousel {
            position: relative;
            height: 80vh;
            width: 100%;
            overflow: hidden;
          }
          
          .hero-slide {
            height: 100%;
            width: 100%;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            transition: all 0.5s ease;
          }
          
          .hero-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
            color: white;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
          }
          
          .hero-content h1 {
            font-size: 3.5rem;
            margin-bottom: 1rem;
          }
          
          .hero-content p {
            font-size: 1.5rem;
            margin-bottom: 2rem;
            max-width: 600px;
          }
          
          .cta-button {
            padding: 0.8rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            background: white;
            color: #2E7D32;
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .cta-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .carousel-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.2);
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: white;
            z-index: 10;
            transition: all 0.3s ease;
          }
          
          .carousel-nav:hover {
            background: rgba(255,255,255,0.3);
          }
          
          .prev {
            left: 2rem;
          }
          
          .next {
            right: 2rem;
          }
          
          .carousel-dots {
            position: absolute;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 1rem;
          }
          
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(255,255,255,0.5);
            border: none;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .dot.active {
            background: white;
            transform: scale(1.2);
          }
          
          /* Stats Section */
          .stats-section {
            background: #f8f9fa;
            padding: 4rem 2rem;
          }
          
          .stats-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
          }
          
          .stat-card {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          }
          
          .stat-card h3 {
            font-size: 2.5rem;
            color: #2E7D32;
            margin-bottom: 0.5rem;
          }
          
          /* Features Section */
          .features-section {
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .features-section h2 {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            color: #2E7D32;
          }
          
          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          
          .feature-card {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          
          .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
          }
          
          .feature-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #2E7D32;
          }
          
          /* Video Section */
          .video-section {
            padding: 4rem 2rem;
            background: #f8f9fa;
          }
          
          .video-section h2 {
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2.5rem;
            color: #2E7D32;
          }
          
          .video-container {
            max-width: 1000px;
            margin: 0 auto;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          }
          
          /* Process Section */
          .process-section {
            padding: 4rem 2rem;
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .process-section h2 {
            text-align: center;
            margin-bottom: 3rem;
            font-size: 2.5rem;
            color: #2E7D32;
          }
          
          .process-steps {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
          }
          
          .process-step {
            background: white;
            border-radius: 10px;
            padding: 2rem;
            text-align: center;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
            transition: all 0.3s ease;
          }
          
          .process-step:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
          
          .step-number {
            width: 50px;
            height: 50px;
            background: #2E7D32;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0 auto 1rem;
          }
          
          /* CTA Section */
          .cta-section {
            background: #2E7D32;
            color: white;
            padding: 4rem 2rem;
            text-align: center;
          }
          
          .cta-content {
            max-width: 800px;
            margin: 0 auto;
          }
          
          .cta-content h2 {
            font-size: 2.5rem;
            margin-bottom: 1rem;
          }
          
          .cta-content p {
            font-size: 1.2rem;
            margin-bottom: 2rem;
            opacity: 0.9;
          }
          
          .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }
          
          .primary-button, .secondary-button {
            padding: 0.8rem 2rem;
            border-radius: 50px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .primary-button {
            background: white;
            color: #2E7D32;
            border: none;
          }
          
          .secondary-button {
            background: transparent;
            color: white;
            border: 2px solid white;
          }
          
          .primary-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .secondary-button:hover {
            background: rgba(255,255,255,0.1);
          }
          
          /* Floating Chat */
          .floating-chat {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #2E7D32;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            transition: all 0.3s ease;
          }
          
          .floating-chat:hover {
            transform: scale(1.1);
          }
          
          /* Responsive Styles */
          @media (max-width: 768px) {
            .hero-content h1 {
              font-size: 2.5rem;
            }
            
            .hero-content p {
              font-size: 1.2rem;
            }
            
            .stats-container, .features-grid, .process-steps {
              grid-template-columns: 1fr 1fr;
            }
            
            .cta-buttons {
              flex-direction: column;
              align-items: center;
            }
          }
          
          @media (max-width: 480px) {
            .hero-content h1 {
              font-size: 2rem;
            }
            
            .stats-container, .features-grid, .process-steps {
              grid-template-columns: 1fr;
            }
            
            .carousel-nav {
              width: 40px;
              height: 40px;
            }
          }
        `}</style>
      </div>
    </>
  );
}