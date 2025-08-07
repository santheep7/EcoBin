// Footer.jsx
import React from 'react';
import { Recycle, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Footer = ({ isLoggedIn }) => {
  const navigate = useNavigate();

  const handleSchedulePickup = () => {
    if (isLoggedIn) {
      navigate('/request');
    } else {
      toast.warn('Please log in to schedule a pickup.', {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };
  // const handlemessage= () => {
  //   if (isLoggedIn) {
  //     navigate('/contact');
  //   } else {
  //     toast.warn('Please log in to contact Us.', {
  //       position: 'bottom-center',
  //       autoClose: 3000,
  //       hideProgressBar: true,
  //     });
  //   }
  // };

  return (
    <>
      <footer style={{
        backgroundColor: '#2E7D32',
        color: 'white',
        padding: '2rem 0',
        marginTop: '3rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem'
        }}>
          {/* Logo Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <Recycle size={24} style={{ marginRight: '0.5rem' }} />
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>EcoBin</span>
            </div>
            <p style={{ color: '#E0E0E0', fontSize: '0.875rem' }}>
              Making e-waste recycling accessible, convenient, and impactful for everyone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href="#" style={{ color: '#A5D6A7' }}><Facebook size={20} /></a>
              <a href="#" style={{ color: '#A5D6A7' }}><Twitter size={20} /></a>
              <a href="#" style={{ color: '#A5D6A7' }}><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#E0E0E0' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/homepage" style={{ color: '#E0E0E0', textDecoration: 'none' }}>Home</Link>
              </li>
              <li style={{ marginBottom: '0.5rem', cursor: 'pointer' }} onClick={handleSchedulePickup}>
                <span style={{ color: '#E0E0E0', textDecoration: 'none' }}>
                  Schedule Pickup
                </span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Support</h3>
            <ul style={{ listStyle: 'none', padding: 0, color: '#E0E0E0' }}>
              
              <li style={{ marginBottom: '0.5rem' }}>
                <Link to="/contact" style={{ color: '#E0E0E0', textDecoration: 'none' }}>Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 style={{ fontWeight: '600', marginBottom: '1rem' }}>Contact</h3>
            <address style={{ fontStyle: 'normal', color: '#E0E0E0' }}>
              <p>123 Eco Street</p>
              <p>Green City, Earth 12345</p>
              <p style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center' }}>
                <Mail size={16} style={{ marginRight: '0.5rem' }} />
                <a href="mailto:info@ecorecycle.com" style={{ color: '#E0E0E0', textDecoration: 'none' }}>
                  info@ecobin.com
                </a>
              </p>
            </address>
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          borderTop: '1px solid #1B5E20',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: '#A5D6A7'
        }}>
          <p>© {new Date().getFullYear()} EcoBin. All rights reserved.</p>
        </div>
      </footer>

      {/* Toast Message Container */}
      <ToastContainer />
    </>
  );
};

export default Footer;
