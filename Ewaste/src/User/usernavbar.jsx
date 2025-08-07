import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { toast, ToastContainer, Bounce } from 'react-toastify';

export default function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const usernameLettersRef = useRef([]);
  const navRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedName = localStorage.getItem('name');
    setIsLoggedIn(!!token);
    if (savedName) {
      setUsername(savedName);
      setTimeout(() => {
        gsap.fromTo(
          usernameLettersRef.current,
          { opacity: 0, scale: 0.5, y: -20 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1,
            stagger: 0.07,
            ease: 'elastic.out(1, 0.5)',
          }
        );
      }, 300);
    }

    const handleScroll = () => {
      if (window.scrollY > 10) {
        navRef.current.classList.add('bg-gradient-to-r', 'from-green-700', 'to-lime-600', 'shadow-lg', 'py-2');
      } else {
        navRef.current.classList.remove('bg-gradient-to-r', 'from-green-700', 'to-lime-600', 'shadow-lg', 'py-2');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRequest = () => {
    if (isLoggedIn) {
      navigate('/request');
    } else {
      toast.info('⚠️ Please login first');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  const handleMyRequest = () => {
    if (isLoggedIn) {
      navigate('/UserRequest');
    } else {
      toast.info('⚠️ Please login first');
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={5000} theme="colored" transition={Bounce} />
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 text-white bg-gradient-to-r from-emerald-600 to-lime-600 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          {/* Logo */}
          <div onClick={() => navigate('/')} className="text-2xl font-bold cursor-pointer flex items-center gap-2">
            ♻️ EcoBin
          </div>

          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden text-3xl">
            ☰
          </button>

          {/* Nav Links */}
          <div
            className={`${menuOpen ? 'block' : 'hidden'
              } absolute top-full left-0 w-full lg:static lg:w-auto lg:flex bg-emerald-700 lg:bg-transparent px-4 py-4 lg:p-0 rounded-b-md lg:rounded-none shadow-md lg:shadow-none transition-all`}
          >
            <ul className="flex flex-col lg:flex-row items-start lg:items-center gap-5 lg:gap-8 font-medium w-full">
              <li onClick={() => navigate('/homepage')} className="hover:text-lime-200 cursor-pointer transition">
                Home
              </li>
              <li onClick={handleMyRequest} className="hover:text-lime-200 cursor-pointer transition">
                My Requests
              </li>
              <li onClick={handleRequest} className="hover:text-lime-200 cursor-pointer transition">
                Request
              </li>

              {/* Account Dropdown */}
              <li className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-1 hover:text-lime-200"
                >
                  👤 <span>Account</span>
                </button>
                {showDropdown && (
                  <ul className="absolute right-0 mt-3 w-40 bg-white text-black rounded-xl shadow-lg z-50 overflow-hidden">
                    {!isLoggedIn ? (
                      <>
                        <li
                          className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                          onClick={() => {
                            navigate('/login');
                            setShowDropdown(false);
                          }}
                        >
                          Sign In
                        </li>
                        <li
                          className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                          onClick={() => {
                            navigate('/Userregister');
                            setShowDropdown(false);
                          }}
                        >
                          Sign Up
                        </li>
                      </>
                    ) : (
                      <li
                        className="px-4 py-2 hover:bg-green-100 cursor-pointer"
                        onClick={() => {
                          handleLogout();
                          setShowDropdown(false);
                        }}
                      >
                        Logout
                      </li>
                    )}
                  </ul>
                )}
              </li>
            </ul>

            {/* Animated Username */}
            {username && (
              <div className="mt-1 lg:mt-2 lg:ml-5 text-white text-sm font-semibold tracking-wide flex flex-nowrap gap-[1px]">
                {('Hi, ' + username).split('').map((char, i) => (
                  <span
                    key={`char-${i}`}
                    ref={(el) => (usernameLettersRef.current[i] = el)}
                    className="inline-block"
                  >
                    {char}
                  </span>
                ))}
              </div>

            )}
          </div>
        </div>
      </nav>
    </>
  );
}
