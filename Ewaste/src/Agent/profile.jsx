import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';  // import confetti
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Avatar
} from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import PendingIcon from '@mui/icons-material/Pending';
import { gsap } from 'gsap';
import AgentNavbar from './agentnav';
import './profile.css'

export default function AgentProfile() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const profileRef = useRef(null);
  const agentId = localStorage.getItem('agentId');

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/agent/profile/${agentId}`);
        setAgent(res.data);
      } catch (err) {
        setError("Failed to fetch agent profile");
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchAgent();
    } else {
      setError("No agent ID found. Please log in.");
      setLoading(false);
    }
  }, [agentId]);

  useEffect(() => {
    if (profileRef.current) {
      gsap.fromTo(
        profileRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, [agent]);

  // Confetti blast when agent is verified
  useEffect(() => {
    if (agent?.isApproved) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [agent]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4, mx: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <AgentNavbar />
      <Box
        ref={profileRef}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        <Card
          sx={{
            width: 400,
            p: 3,
            borderRadius: 3,
            boxShadow: 6,
            bgcolor: '#ffffff'
          }}
        >
          <CardContent>
            <Box display="flex" justifyContent="center" mb={2}>
              <Avatar
                sx={{ width: 70, height: 70, bgcolor: '#1976d2', fontSize: 28 }}
              >
                {agent.agentname.charAt(0).toUpperCase()}
              </Avatar>
            </Box>
            <Typography variant="h5" align="center" gutterBottom>
              {agent.name}
            </Typography>

            <Box my={2}>
              <Typography><strong>Email:</strong> {agent.email}</Typography>
              <Typography><strong>Phone:</strong> {agent.phone}</Typography>
              <Typography><strong>Aadhar ID:</strong> {agent.adharid}</Typography>
            </Box>

            <Box textAlign="center" mt={3}>
              {agent.isApproved ? (
                <Chip
                  icon={<VerifiedIcon />}
                  label="Profile Verified"
                  color="success"
                  variant="filled"
                />
              ) : (
                <Chip
                  icon={<PendingIcon />}
                  label="Pending Verification"
                  color="warning"
                  variant="filled"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
