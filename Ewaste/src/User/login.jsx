import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Typography, Box, Link } from '@mui/material';
import axios from 'axios';
import { gsap } from 'gsap';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Navbar from './usernavbar';

export default function Login() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [record, setRecord] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("password"); // 'password' or 'otp' mode
  const [loading, setLoading] = useState(false);
  const bgRef = useRef(null);
  const sunRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      sunRef.current,
      { y: 300, opacity: 0 },
      { y: 0, opacity: 0.7, duration: 4, ease: 'power2.out', delay: 0.5 }
    );
    gsap.fromTo(
      bgRef.current,
      { backgroundColor: '#FAF6E9' },
      { backgroundColor: '#0D1B2A', duration: 4, ease: 'power2.inOut', delay: 0.5 }
    );
  }, []);

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const validatePasswordLogin = () => {
    const newError = {};
    if (!record.email.trim()) newError.email = "Email is required";
    if (!record.password) newError.password = "Password is required";
    return newError;
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validatePasswordLogin();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/login`, record);
      if (res.data.status === 200) {
        localStorage.setItem("id", res.data.id);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        toast.success("Login Successful!");
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(res.data.msg || "Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Occurred");
    } finally {
      setLoading(false);
    }
  };

  // OTP Login handlers
  const sendOtp = async () => {
    if (!record.email.trim()) {
      toast.error("Please enter your email.");
      return;
    }
    setLoading(true);
    try {
await axios.post(`${API_BASE_URL}/api/user/request-otp-login`, { email: record.email });
      toast.success("OTP sent to your email!");
      setStep("otp-verify");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      toast.error("Please enter the OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/user/verify-otp-login`, {
  email: record.email,
  otp,
});

      if (res.data.status === 200) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("id", res.data.id);
        toast.success("Login successful!");
        setTimeout(() => navigate("/homepage"), 1500);
      } else {
        toast.error("Invalid OTP.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        theme="dark"
        transition={Bounce}
      />
      <div
        ref={bgRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
          backgroundColor: '#F3C623',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
        }}
      >
        <div
          ref={sunRef}
          style={{
            position: 'absolute',
            bottom: '-200px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '400px',
            height: '400px',
            opacity: 0,
            zIndex: 0,
          }}
          dangerouslySetInnerHTML={{
            __html: `
              <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
                <circle cx="256" cy="256" r="256" fill="#FFC552" />
              </svg>
            `,
          }}
        />
        <Container
          maxWidth="xs"
          sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 2, boxShadow: 3, position: 'relative', zIndex: 1 }}
        >
          <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>Login</Typography>

            {/* Toggle buttons */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant={step === "password" ? "contained" : "outlined"}
                onClick={() => { setStep("password"); setError({}); }}
                sx={{ mr: 1 }}
              >
                Password Login
              </Button>
              <Button
                variant={step === "otp" || step === "otp-verify" ? "contained" : "outlined"}
                onClick={() => { setStep("otp"); setError({}); setOtp(""); }}
              >
                OTP Login
              </Button>
            </Box>

            {step === "password" && (
              <>
                <TextField
                  margin="normal"
                  label="Email"
                  name="email"
                  fullWidth
                  value={record.email}
                  onChange={handleChange}
                  error={!!error.email}
                  helperText={error.email}
                  autoComplete='off'
                  autoFocus
                />
                <TextField
                  margin="normal"
                  label="Password"
                  type="password"
                  name="password"
                  fullWidth
                  value={record.password}
                  onChange={handleChange}
                  error={!!error.password}
                  helperText={error.password}
                  autoComplete='off'
                />
                <Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={handlePasswordLogin} disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </>
            )}

            {(step === "otp" || step === "otp-verify") && (
              <>
                <TextField
                  margin="normal"
                  label="Email"
                  name="email"
                  fullWidth
                  value={record.email}
                  onChange={handleChange}
                  disabled={step === "otp-verify"}
                  error={!!error.email}
                  helperText={error.email}
                />

                {step === "otp" && (
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={sendOtp}
                    disabled={loading || !record.email.trim()}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </Button>
                )}

                {step === "otp-verify" && (
                  <>
                    <TextField
                      margin="normal"
                      label="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      fullWidth
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={verifyOtp}
                      disabled={loading || !otp.trim()}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    <Button
                      fullWidth
                      variant="text"
                      sx={{ mt: 1 }}
                      onClick={sendOtp}
                      disabled={loading}
                    >
                      Resend OTP
                    </Button>
                  </>
                )}
              </>
            )}

            <Typography sx={{ mt: 2, fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <Link href="/Userregister" underline="hover" sx={{ fontWeight: 'bold', color: '#ee0979' }}>
                Register
              </Link>
            </Typography>
          </Box>
        </Container>
      </div>
    </>
  );
}
