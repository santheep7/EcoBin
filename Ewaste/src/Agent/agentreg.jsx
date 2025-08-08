import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import AgentNavbar from './agentnav';


export default function AgentRegister() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [agentData, setAgentData] = useState({
    agentname: '',
    adharid: '',
    email: '',
    phone: '',
    place: '',
    password: '',
  });

  const handleChange = (e) => {
    setAgentData({ ...agentData, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    const { agentname, adharid, email, phone, password,place } = agentData;

    if (!agentname || !adharid || !email || !phone || !password|| !place) {
      toast.error('Please fill all fields');
      return false;
    }

    if (!/^\d{12}$/.test(adharid)) {
      toast.error('Aadhaar ID must be a 12-digit number');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email');
      return false;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error('Phone number must be 10 digits');
      return false;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/api/agent/agentreg`, agentData);
      toast.success('Registration successful');
      setAgentData({ agentname: '', adharid: '', email: '', phone: '',place:'', password: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  return (
    <>
      <AgentNavbar />
      <Grid container justifyContent="center" sx={{ mt: 12 }}>
        <ToastContainer position="top-center" />
        <Grid item xs={11} sm={8} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Agent Registration
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <TextField
                fullWidth
                label="Full Name"
                name="agentname"
                value={agentData.agentname}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Aadhaar ID"
                name="adharid"
                value={agentData.adharid}
                onChange={handleChange}
                margin="normal"
                required
                type="number"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={agentData.email}
                onChange={handleChange}
                margin="normal"
                required
                type="email"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={agentData.phone}
                onChange={handleChange}
                margin="normal"
                required
                type="tel"
              />
              <TextField
                fullWidth
                label="Place"
                name="place"
                value={agentData.place}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                value={agentData.password}
                onChange={handleChange}
                margin="normal"
                required
                type="password"
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register
              </Button>

              {/* Login Link */}
              <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                Already have an account?{' '}
                <Link to="/agentlogin" style={{ color: '#1976d2', textDecoration: 'none' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
