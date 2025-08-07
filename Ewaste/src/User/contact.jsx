import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./usernavbar";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

export default function ContactForm() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [formdata, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const Navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${API_BASE_URL}/api/msg/createmsg`, formdata);
    toast.success("Message sent successfully!");

    setFormData({ name: '', email: '', message: '' });

    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('userId'); // adjust key if needed

    // Redirect based on login status after a short delay for toast
    setTimeout(() => {
      if (isLoggedIn) {
        Navigate('/userhome'); // replace with your actual logged-in home page
      } else {
        Navigate('/'); // unlogged user home page
      }
    }, 1500);
    
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to send message");
  }
};

  return (
    <>
      <ToastContainer autoClose={2000}/>
      <Navbar />
      <div style={{
        paddingTop: "100px",
        minHeight: "100vh",
        background: "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=1470&q=80') center center/cover no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>


        <div className="container d-flex justify-content-center align-items-center">
          <div className="card shadow p-4" style={{ maxWidth: "500px", width: "100%", borderRadius: "1rem" }}>
            <h2 className="text-center mb-4" style={{ color: "#2E7D32", fontWeight: "600" }}>Contact Us</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  autoComplete="off"
                  placeholder="Enter your name"
                  value={formdata.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter your email"
                  autoComplete="off"
                  value={formdata.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  name="message"
                  rows="4"
                  autoComplete="off"
                  placeholder="Type your message here..."
                  value={formdata.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-success w-100">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
