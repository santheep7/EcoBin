import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, Typography, Container, Box, Grid } from "@mui/material";
import { gsap } from "gsap";
import axios from "axios";
import AgentNavbar from './agentnav';

export default function AgentHome() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const headerRef = useRef(null);
  const statRefs = useRef([]);
  const aboutRef = useRef(null);//hi

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/req/approvedrequests`);
        setRequests(res.data);
      } catch (err) {
        console.error("Error fetching requests:", err);
      }
    };
    fetchApproved();
  }, []);

  const assignedPickups = requests.length;
  const completedJobs = requests.filter(r => r.isPickedUp).length;
  const pendingRequests = assignedPickups - completedJobs;

  const statData = [
    { id: "card1", title: "Assigned Pickups", value: assignedPickups, color: "#2e7d32" },
    { id: "card2", title: "Pending Requests", value: pendingRequests, color: "#ed6c02" },
    { id: "card3", title: "Completed Jobs", value: completedJobs, color: "#0288d1" },
  ];

  useEffect(() => {
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out", delay: 0.4 }
    );

    gsap.fromTo(
      statRefs.current,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power1.out",
        delay: 0.8,
        stagger: 0.2,
      }
    );

    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out", delay: 1.6 }
    );
  }, [requests]);

  return (
    <>
      <AgentNavbar />
      <Box component="main" sx={{ 
        backgroundColor: "#f5f5f5", 
        minHeight: "calc(100vh - 64px)", // Adjust for navbar height
        pt: 0, 
        marginTop:'40px'// Remove top padding
      }}>
        {/* Hero Section - now flush with navbar */}
        <Box 
          ref={headerRef} 
          sx={{ 
            backgroundColor: "#ffffff",
            color: "#333333", 
            textAlign: "center", 
            py: 6,
            px: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            borderTop: '1px solid #e0e0e0' // subtle border to connect with navbar
          }}
        >
          <Container maxWidth="md">
            <Typography variant="h3" gutterBottom sx={{ 
              fontWeight: 700,
              mb: 2,
              color: "#2e7d32"
            }}>
              Welcome Back, Agent!
            </Typography>
            <Typography variant="subtitle1" sx={{ 
              color: "#666666",
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Your comprehensive dashboard for managing e-waste pickups
            </Typography>
          </Container>
        </Box>

        {/* Stats Cards */}
        <Container maxWidth="lg" sx={{ px: { xs: 2, md: 4 }, py: 4, mb: 0 }}>
          <Grid container spacing={3} justifyContent="center">
            {statData.map((stat, i) => (
              <Grid item xs={12} sm={6} md={4} key={stat.id}>
                <Card
                  ref={(el) => (statRefs.current[i] = el)}
                  sx={{ 
                    height: '100%',
                    backgroundColor: "#ffffff",
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <CardContent sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ 
                      color: stat.color,
                      fontWeight: 600,
                      mb: 2
                    }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h2" sx={{ 
                      fontWeight: 700,
                      color: "#333333"
                    }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        {/* About Section */}
        <Container
          ref={aboutRef}
          maxWidth="md"
          sx={{
            px: { xs: 2, md: 4 },
            py: 4
          }}
        >
          <Card sx={{ 
            backgroundColor: "#ffffff",
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            p: { xs: 3, md: 4 }
          }}>
            <Typography variant="h5" sx={{ 
              color: "#2e7d32",
              fontWeight: 600,
              mb: 3
            }}>
              Dashboard Overview
            </Typography>
            <Typography paragraph sx={{ 
              color: "#555555",
              mb: 3
            }}>
              This panel provides real-time insights into your e-waste collection activities. 
              Monitor assigned pickups, track pending requests, and review completed jobs 
              all in one place.
            </Typography>
            <Typography paragraph sx={{ 
              color: "#555555"
            }}>
              For detailed information about specific requests, visit the "Pickup Requests" 
              section. You'll receive notifications for new assignments and status updates.
            </Typography>
          </Card>
        </Container>

        {/* Footer */}
        <Box sx={{ 
          backgroundColor: "#ffffff",
          py: 3,
          mt: 4,
          borderTop: '1px solid #e0e0e0'
        }}>
          <Typography sx={{ 
            textAlign: "center", 
            color: '#666666'
          }} variant="body2">
            © {new Date().getFullYear()} E-Waste Management System | Agent Portal
          </Typography>
        </Box>
      </Box>
    </>
  );
}