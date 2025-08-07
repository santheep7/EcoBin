import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Paper,
  Container
} from '@mui/material';
import { gsap } from 'gsap';
import AgentNavbar from './agentnav';

export default function ViewApprovedRequests() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsRef = useRef([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
  const fetchApproved = async () => {
    try {
      const agentId = localStorage.getItem('agentId');
      console.log("Fetched agentId from localStorage:", agentId); // retrieve agent id from storage or session

      if (!agentId) {
        setError('Agent ID not found in local storage');
        setLoading(false);
        return;
      }

      const res = await axios.get(`${API_BASE_URL}/api/req/approvedrequests`, {
        headers: {
          'x-agent-id': agentId
        }
      });

      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching approved requests:', err);
      setError('Failed to load approved requests.');
      setLoading(false);
    }
  };

  fetchApproved();
}, []);


  useEffect(() => {
    if (requests.length > 0) {
      gsap.fromTo(
        rowsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.15,
        }
      );
    }
  }, [requests]);

  const handleTogglePickup = async (requestId, currentStatus) => {
    try {
      const updated = await axios.patch(
        `${API_BASE_URL}/api/req/updatepickupstatus/${requestId}`,
        { isPickedUp: !currentStatus }
      );
      setRequests((prev) =>
        prev.map((req) => (req._id === requestId ? updated.data.request : req))
      );
    } catch (err) {
      console.error('Failed to update pickup status:', err);
      setError('Could not update pickup status.');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 3, textAlign: 'center' }}>
        {error}
      </Alert>
    );
  }

  if (requests.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 3, textAlign: 'center' }}>
        No approved requests found.
      </Alert>
    );
  }

  return (
    <>
      <AgentNavbar />
      <Box
        sx={{
          minHeight: '100vh',
          py: 4,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '40%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(46,125,50,0.05) 0%, rgba(46,125,50,0.01) 100%)',
            zIndex: 0,
            
          }
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            zIndex: 1,
            marginTop:'50px'
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 600,
            color: '#2e7d32',
            mb: 4,
            textAlign: 'center',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '80px',
              height: '4px',
              background: '#2e7d32',
              margin: '16px auto 0',
              borderRadius: '2px',
             
            }
          }}>
            Approved Pickup Requests
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {requests.map((req, idx) => (
              <Paper
                key={req._id}
                ref={(el) => (rowsRef.current[idx] = el)}
                elevation={3}
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'space-between',
                  alignItems: isMobile ? 'flex-start' : 'center',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  p: 3,
                  gap: 3,
                  transition: 'all 0.3s ease',
                  borderLeft: '4px solid #2e7d32',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(0,0,0,0.1)'
                  },
                }}
              >
                <Box sx={{ flex: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} color="text.primary" gutterBottom>
                    Request #{idx + 1}
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography variant="body2">
                        <strong>User:</strong> {req.user?.name || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Email:</strong> {req.user?.email || 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>E-Waste Type:</strong> {req.ewasteType}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2">
                        <strong>Quantity:</strong> {req.quantity}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Pickup Date:</strong> {new Date(req.pickupDate).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Slot:</strong> {req.timeSlot}
                      </Typography>
                    </Box>
                  </Box>
                  {req.notes && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        <strong>Notes:</strong> {req.notes}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    gap: 2,
                    minWidth: isMobile ? '100%' : '140px',
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: isMobile ? 'flex-start' : 'flex-end',
                    gap: 1
                  }}>
                    <Typography variant="subtitle2" color="primary" fontWeight={600}>
                      Status: {req.status}
                    </Typography>
                    <Typography
                      variant="subtitle2"
                      color={req.isPickedUp ? 'success.main' : 'error.main'}
                      fontWeight={600}
                    >
                      Picked Up: {req.isPickedUp ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Button
                    variant={req.isPickedUp ? 'outlined' : 'contained'}
                    color={req.isPickedUp ? 'warning' : 'primary'}
                    size={isMobile ? 'medium' : 'small'}
                    onClick={() => handleTogglePickup(req._id, req.isPickedUp)}
                    fullWidth={isMobile}
                    sx={{
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {req.isPickedUp ? 'Undo Pickup' : 'Mark as Picked Up'}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
}