import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import Navbar from './usernavbar';
import './userReq.css'
export default function MyRequests() {
  const API_BASE_URL = import.meta.env.API_BASE_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMyRequests = async () => {
    try {
      const userId = localStorage.getItem('id');
      if (!userId) throw new Error('User ID not found in localStorage');

      const { data } = await axios.get(`${API_BASE_URL}/api/req/GetUserRequest`, {
        headers: {
          'x-user-id': userId
        }
      });

      setRequests(data);
    } catch (err) {
      console.error('Error fetching my requests:', err);
      setError('Failed to load your pickup requests.');
    } finally {
      setLoading(false);
    }
  };

  const cancelRequest = async (id) => {
  try {
    await axios.put(`${API_BASE_URL}/api/req/CancelRequest/${id}`);
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: 'cancelled' } : r))
    );
  } catch (err) {
    console.error('Error cancelling request:', err);
    alert('Failed to cancel the request.');
  }
};

  useEffect(() => {
    fetchMyRequests();
  }, []);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading your requests…
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <>
    <Navbar/>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" style={{marginTop:"75px"}} gutterBottom>
        My Pickup Requests
      </Typography>

      {requests.length === 0 ? (
        <Alert severity="info">You have not submitted any pickup requests yet.</Alert>
      ) : (
        <Grid container spacing={2}>
          {requests.map((req) => {
            const {
              _id,
              ewasteType,
              quantity,
              pickupDate,
              timeSlot,
              notes,
              status = 'pending',
              isPickedUp = false,
              image
            } = req;

            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  {image ? (
                    <CardMedia
                      component="img"
                      image={`${API_BASE_URL}/uploads/${image}`}
                      alt="E-waste"
                      height="140"
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        height: '140px',
                        backgroundColor: '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      No Image
                    </div>
                  )}

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="body2"><strong>Type:</strong> {ewasteType}</Typography>
                    <Typography variant="body2"><strong>Qty:</strong> {quantity}</Typography>
                    <Typography variant="body2"><strong>Date:</strong> {new Date(pickupDate).toLocaleDateString()}</Typography>
                    <Typography variant="body2"><strong>Time:</strong> {timeSlot}</Typography>
                    <Typography variant="body2" gutterBottom><strong>Notes:</strong> {notes || '—'}</Typography>

                    <Chip
                      label={status}
                      color={
                        status === 'approved' ? 'success' :
                        status === 'rejected' ? 'error' :
                        status === 'cancelled' ? 'default' : 'warning'
                      }
                      size="small"
                      sx={{ mr: 1, mb: 1, textTransform: 'capitalize' }}
                    />
                    <Chip
                      label={isPickedUp ? 'Picked Up' : 'Not Picked Up'}
                      color={isPickedUp ? 'success' : 'warning'}
                      size="small"
                      sx={{ mb: 1 }}
                    />

                    {!isPickedUp && status !== 'cancelled' && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => cancelRequest(_id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
    </>
  );
}
