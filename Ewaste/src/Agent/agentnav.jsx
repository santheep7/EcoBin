import React, { useEffect, useState, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';

// Animated Underline Button with progressive line fill effect
const AnimatedUnderlineButton = React.forwardRef(({ children, ...props }, ref) => {
  const underlineRef = useRef(null);
  const tl = useRef(null);

  useEffect(() => {
    tl.current = gsap.timeline({ paused: true });
    tl.current.to(underlineRef.current, {
      width: '100%',
      duration: 0.8,
      ease: 'power2.out',
      boxShadow: '0 0 10px #64ffda',
    });
    gsap.set(underlineRef.current, { width: '0%', boxShadow: 'none' });
  }, []);

  const handleMouseEnter = () => {
    tl.current.play();
  };

  const handleMouseLeave = () => {
    tl.current.reverse();
  };

  return (
    <Button
      {...props}
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disableRipple
      sx={{
        color: '#ffffff',
        textTransform: 'none',
        fontWeight: 500,
        position: 'relative',
        paddingBottom: '6px',
        overflow: 'visible',
        fontSize: '0.9rem',
        '&:hover': {
          backgroundColor: 'transparent',
          color: '#64ffda',
        },
      }}
    >
      {children}
      <span
        ref={underlineRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          width: '0%',
          background: 'linear-gradient(90deg, #64ffda, #00bfa5)',
          borderRadius: '2px',
          pointerEvents: 'none',
        }}
      />
    </Button>
  );
});

export default function AgentNavbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [agentName, setAgentName] = useState('');
  const [isApproved, setIsApproved] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const publicPaths = ['/agentlogin', '/agentreg'];

  useEffect(() => {
    const token = localStorage.getItem('agentToken');
    const name = localStorage.getItem('agentname');
    const approved = localStorage.getItem('isApproved') === 'true';

    setAgentName(name || '');
    setIsApproved(approved);

    if (!token && !publicPaths.includes(location.pathname)) {
      navigate('/agentlogin');
    }
  }, [location.pathname, navigate]);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/agentlogin');
  };

  const navLinks = [
    { label: 'Home', path: '/agenthome' },
    ...(isApproved ? [{ label: 'Requests', path: '/viewuserRequest' }] : []),
    { label: 'Profile', path: '/profile' },
    { label: 'Map View', path: '/AgentMapView' },
  ];

  if (!agentName) {
    return (
      <AppBar 
        position="fixed" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#121212',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(18, 18, 18, 0.8)'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              color: '#64ffda',
              letterSpacing: '0.05rem',
              fontFamily: '"Roboto Mono", monospace'
            }}
          >
            AgentZone
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AnimatedUnderlineButton component={Link} to="/agentlogin">
              Sign In
            </AnimatedUnderlineButton>
            <AnimatedUnderlineButton component={Link} to="/agentreg">
              Sign Up
            </AnimatedUnderlineButton>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <AppBar 
      position="fixed" 
      elevation={0} 
      sx={{ 
        backgroundColor: '#121212',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(10px)',
        background: 'rgba(18, 18, 18, 0.8)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 24px' }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700, 
            color: '#64ffda',
            letterSpacing: '0.05rem',
            fontFamily: '"Roboto Mono", monospace'
          }}
        >
          AgentZone
        </Typography>

        {isMobile ? (
          <>
            <IconButton 
              edge="end" 
              onClick={handleMenu} 
              sx={{ 
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: 'rgba(100, 255, 218, 0.1)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleClose}
              PaperProps={{
                style: {
                  backgroundColor: '#1e1e1e',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.12)'
                }
              }}
            >
              {navLinks.map(({ label, path }) => (
                <MenuItem 
                  key={label} 
                  onClick={handleClose} 
                  component={Link} 
                  to={path}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(100, 255, 218, 0.1)'
                    }
                  }}
                >
                  {label}
                </MenuItem>
              ))}
              <MenuItem
                onClick={() => {
                  handleClose();
                  handleLogout();
                }}
                sx={{
                  color: '#ff5252',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 82, 82, 0.1)'
                  }
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            {navLinks.map(({ label, path }) => (
              <AnimatedUnderlineButton key={label} component={Link} to={path}>
                {label}
              </AnimatedUnderlineButton>
            ))}
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500, 
                color: '#ffffff',
                fontFamily: '"Roboto", sans-serif',
                fontSize: '0.9rem'
              }}
            >
              Hi, {agentName}
            </Typography>
            <AnimatedUnderlineButton 
              onClick={handleLogout}
              sx={{
                color: '#ff5252',
                '&:hover': {
                  color: '#ff5252',
                },
                '& span': {
                  background: 'linear-gradient(90deg, #ff5252, #d32f2f)'
                }
              }}
            >
              Logout
            </AnimatedUnderlineButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}