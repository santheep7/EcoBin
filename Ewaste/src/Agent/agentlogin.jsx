import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';
import { gsap } from 'gsap';
import './Agentlogin.css';
import AgentNavbar from './agentnav';


export default function AgentLogin() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );
  }, []);

  const validateEmail = (email) => {
    // Simple regex for email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email and password are required.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${API_BASE_URL}/api/agent/agentlogin`,
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (data.status === 200) {
        localStorage.setItem('agentToken', data.token);
        localStorage.setItem("agentId", data.agentId);
        localStorage.setItem('agentname', data.agentname);
        localStorage.setItem('isApproved', data.isApproved.toString());
        navigate('/agenthome');
      } else {
        setErrorMsg(data.message || 'Login failed.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Server error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AgentNavbar />
      <Box
        sx={{
          height: '100vh',
          backgroundImage: 'url(/assets/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{ p: 4, maxWidth: 400, width: '100%', backdropFilter: 'blur(5px)' }}
          ref={cardRef}
        >
          <Typography variant="h5" component="h1" gutterBottom align="center">
            Agent Login
          </Typography>

          <form onSubmit={handleSubmit} noValidate>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              margin="normal"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {errorMsg && (
              <Typography
                color="error"
                variant="body2"
                sx={{ mt: 1, mb: 1, textAlign: 'center' }}
              >
                {errorMsg}
              </Typography>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          {/* Registration Link */}
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{' '}
            <Link to="/agentreg" style={{ color: '#1976d2', textDecoration: 'none' }}>
              Register here
            </Link>
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
