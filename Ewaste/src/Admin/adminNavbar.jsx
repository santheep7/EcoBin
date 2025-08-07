import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

export default function AdminNavbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const usernameLettersRef = useRef([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem('Admin');
    setUsername(savedName);

    setTimeout(() => {
      gsap.fromTo(
        usernameLettersRef.current,
        { opacity: 0, scale: 0.2, y: -20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }, 300);
  }, []);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white fixed top-0 w-full z-50 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 text-xl font-semibold">Admin Panel</div>

          <div className="hidden md:flex md:items-center gap-4">
            <button onClick={() => navigate('/adminhome')} className="hover:text-green-400 relative">
              Home<span className="absolute bottom-0 left-0 h-0.5 w-0 bg-green-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => navigate('/viewAgent')} className="hover:text-green-400 relative">
              View Agent
            </button>
            <button onClick={() => navigate('/viewuser')} className="hover:text-green-400 relative">
              View Users
            </button>
            <button onClick={() => navigate('/AdminMessage')} className="hover:text-green-400 relative">
              Inbox
            </button>
            <button onClick={() => navigate('/viewrequest')} className="hover:text-green-400 relative">
              Pickup Requests
            </button>
            <button onClick={handleLogout} className="hover:text-red-400 relative">
              Logout
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <button onClick={() => navigate('/adminhome')} className="block w-full text-left">Home</button>
          <button onClick={() => navigate('/viewAgent')} className="block w-full text-left">View Agent</button>
          <button onClick={() => navigate('/viewuser')} className="block w-full text-left">View Users</button>
          <button onClick={() => navigate('/AdminMessage')} className="block w-full text-left">Inbox</button>
          <button onClick={() => navigate('/viewrequest')} className="block w-full text-left">Pickup Requests</button>
          <button onClick={handleLogout} className="block w-full text-left text-red-400">Logout</button>
        </div>
      )}

      {username && (
        <div className="text-green-400 text-center font-bold text-lg tracking-wide py-2">
          {username.split('').map((letter, i) => (
            <span
              key={i}
              ref={el => (usernameLettersRef.current[i] = el)}
              className="inline-block mx-0.5"
            >
              {letter}
            </span>
          ))}
        </div>
      )}
    </nav>
  );
}
