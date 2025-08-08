import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from './usernavbar';
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography, Paper, Container } from "@mui/material";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { gsap } from "gsap";
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default function Register() {
  const API_BASE_URL = import.meta.env.API_BASE_URL;
  const [record, setRecord] = useState({
    name: "",
    place: "",
    address: "",
    phone: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    return score;
  };

  const getStrengthColor = (score) => {
    switch (score) {
      case 1: return 'red';
      case 2: return 'orange';
      case 3: return 'yellowgreen';
      case 4: return 'green';
      default: return '#ccc';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecord({ ...record, [name]: value });

    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const validate = () => {
    const newError = {};
    if (!record.name.trim()) newError.name = "Name is required";
    if (!record.place.trim()) newError.place = "Place is required";
    if (!record.address.trim()) newError.address = "Address is required";
    if (!record.phone.trim()) newError.phone = "Phone is required";
    if (!record.email.trim()) newError.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(record.email)) newError.email = "Email format is invalid";

    if (!record.password.trim()) {
      newError.password = "Password is required";
    } else {
      const strength = checkPasswordStrength(record.password);
      if (strength < 4) {
        newError.password = "Password must be 8+ chars, with uppercase, number & special symbol";
      }
    }

    return newError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setError(validationErrors);
      return;
    }

    axios.post(`${API_BASE_URL}/api/user/request-otp`, record)
      .then((res) => {
        toast.success("OTP sent to your email/phone.");
        setOtpSent(true);
        setTempUserId(res.data.userId);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Failed to send OTP.");
      });
  };

  const handleOtpVerification = () => {
    axios.post(`${API_BASE_URL}/api/user/verify-otp`, {
      userId: tempUserId,
      otp: otp
    }).then((res) => {
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    }).catch((err) => {
      toast.error("Invalid or expired OTP.");
    });
  };

  useEffect(() => {
    const lines = document.querySelectorAll(".circuit-line");
    gsap.fromTo(
      lines,
      { scaleX: 0, opacity: 0.2 },
      {
        scaleX: 1,
        opacity: 1,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: {
          each: 0.3,
          from: "start"
        },
        ease: "power2.inOut"
      }
    );
  }, []);

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} theme="light" transition={Bounce} />
      <Box sx={{
        position: "fixed", width: "100%", height: "100%", overflow: "hidden", zIndex: -1, background: "#0d1117"
      }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <Box
            key={i}
            className="circuit-line"
            sx={{
              position: "absolute", height: "2px", width: "150px", backgroundColor: "#00ffcc",
              top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
              transformOrigin: "left", opacity: 0.2, boxShadow: "0 0 10px #00ffcc"
            }}
          />
        ))}
      </Box>

      <Container maxWidth="sm" sx={{ mt: 10 }}>
        <Paper elevation={5} sx={{ p: 4, position: 'relative', zIndex: 2 }}>
          <Typography variant="h5" mb={2}>Register</Typography>
          {!otpSent ? (
            <form onSubmit={handleSubmit}>
              <TextField fullWidth margin="normal" label="Name" name="name" onChange={handleChange} error={!!error.name} helperText={error.name} autoComplete="off" autoFocus/>
              <TextField fullWidth margin="normal" label="Place" name="place" onChange={handleChange} error={!!error.place} helperText={error.place} autoComplete="off"/>
              <TextField fullWidth margin="normal" label="Address" name="address" onChange={handleChange} error={!!error.address} helperText={error.address} autoComplete="off"/>
              <TextField fullWidth margin="normal" label="Phone" name="phone" type="number" onChange={handleChange} error={!!error.phone} helperText={error.phone} autoComplete="off" />
              <TextField fullWidth margin="normal" label="Email" name="email" type="email" onChange={handleChange} error={!!error.email} helperText={error.email} autoComplete="off"/>

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                autoComplete="off"
                onChange={handleChange}
                error={!!error.password}
                helperText={error.password}
              />

              {/* Password strength bar */}
              <Box sx={{ height: 8, width: '100%', backgroundColor: '#eee', borderRadius: 2, overflow: 'hidden', mt: 1 }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${(passwordStrength / 4) * 100}%`,
                    backgroundColor: getStrengthColor(passwordStrength),
                    transition: 'width 0.3s ease'
                  }}
                />
              </Box>

              <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: 'block' }}>
                {passwordStrength === 0 && ''}
                {passwordStrength === 1 && 'Weak password'}
                {passwordStrength === 2 && 'Moderate password'}
                {passwordStrength === 3 && 'Good password'}
                {passwordStrength === 4 && 'Strong password ✅'}
              </Typography>

              <Button variant="contained" fullWidth type="submit" sx={{ mt: 2 }}>
                Register
              </Button>
            </form>
          ) : (
            <>
              <TextField
                fullWidth
                margin="normal"
                label="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={handleOtpVerification}
                sx={{ mt: 2 }}
              >
                Verify OTP
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </>
  );
}
