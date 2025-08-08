import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { gsap } from 'gsap';
import AdminNavbar from './adminNavbar';
import axios from 'axios';
import './adminhome.css'
export default function AdminHome() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const headerRef = useRef(null);
  const cardRefs = useRef([]);
  const aboutRef = useRef(null);
  const footerRef = useRef(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pickupRequests: 0,
    completedPickups: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/stats`);
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { y: -50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    );

    gsap.fromTo(
      cardRefs.current,
      { opacity: 0, scale: 0.5 },
      { opacity: 1, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.7)', delay: 0.3 }
    );

    gsap.fromTo(
      aboutRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 }
    );

    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power1.out', delay: 1.4 }
    );
  }, [stats]);

  const statData = [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Pickup Requests', value: stats.pickupRequests },
    { label: 'Completed Pickups', value: stats.completedPickups },
  ];

  return (
    <div>
      <AdminNavbar />
      <div className="container mt-5 pt-5">
        {/* Header */}
        <div className="text-center mb-5" ref={headerRef}>
          <h1 className="text-primary">Welcome, Admin!</h1>
          <p className="lead" style={{color:"white"}}>Here's a quick overview of your system.</p>
        </div>

        {/* Stats Cards */}
        <div className="row text-center mb-5">
          {statData.map((item, i) => (
            <div className="col-md-4 mb-3" key={i}>
              <div
                className="card shadow-sm border-0 p-3"
                ref={(el) => (cardRefs.current[i] = el)}
              >
                <h5 className="card-title">{item.label}</h5>
                <p className="display-6 fw-bold">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="row justify-content-center mb-5">
          <div className="col-md-10">
            <div className="card p-4 shadow-sm border-0" ref={aboutRef}>
              <h4 className="mb-3 text-secondary">About This Panel</h4>
              <p>
                Use this dashboard to monitor users, manage pickup requests, and view system
                analytics in real-time. Click through the links in your admin navbar to dive deeper.
              </p>
              <p>
                Need more detail? Visit “Pickup Requests” to assign jobs or “View Users” to update
                profiles and permissions.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-muted small" ref={footerRef}>
          © 2025 E-Waste Management Admin Panel
        </div>
      </div>
    </div>
  );
}
