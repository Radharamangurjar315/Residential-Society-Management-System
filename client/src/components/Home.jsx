import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { keyframes } from '@mui/system';

// Define animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Background bubble component
const Bubble = ({ size, position, color, delay }) => (
  <Box
    sx={{
      position: 'absolute',
      width: size,
      height: size,
      borderRadius: '50%',
      backgroundColor: color,
      opacity: 0.1,
      animation: `${float} 6s ease-in-out infinite`,
      animationDelay: delay,
      ...position,
    }}
  />
);

const HomePage = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Interactive background bubbles */}
      <Bubble size={200} position={{ top: '10%', left: '5%' }} color="#4CAF50" delay="0s" />
      <Bubble size={150} position={{ top: '60%', right: '10%' }} color="#2196F3" delay="1s" />
      <Bubble size={100} position={{ bottom: '10%', left: '15%' }} color="#9C27B0" delay="2s" />
      <Bubble size={180} position={{ top: '30%', right: '20%' }} color="#FF5722" delay="1.5s" />

      {/* Main content container */}
      <Container maxWidth="lg">
        <Box
          sx={{
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
            animation: `${fadeIn} 1s ease-out`,
          }}
        >
          {/* Main heading with gradient text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem' },
              fontWeight: 'bold',
              mb: 2,
              animation: `${pulse} 3s infinite`,
              background: 'linear-gradient(45deg, #2196F3, #4CAF50, #FF5722)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome to Our Community
          </Typography>

          {/* Subtitle with multiple colors */}
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            {['Making', 'Life', 'Better', 'Together'].map((word, index) => (
              <Typography
                key={index}
                variant="h3"
                sx={{
                  color: ['#2196F3', '#4CAF50', '#FF5722', '#9C27B0'][index],
                  fontWeight: 500,
                  animation: `${fadeIn} 1s ease-out`,
                  animationDelay: `${index * 0.2}s`,
                  fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                }}
              >
                {word}
              </Typography>
            ))}
          </Box>

          {/* Description text */}
          <Typography
            variant="h6"
            sx={{
              mt: 4,
              color: '#666',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.8,
              animation: `${fadeIn} 1s ease-out`,
              animationDelay: '0.8s',
            }}
          >
            Experience the perfect blend of modern living and community spirit. 
            Join us in creating a space where every resident feels at home.
          </Typography>
        </Box>
      </Container>

      {/* Interactive hover effect area */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)',
        }}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
          e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
        }}
      />
    </Box>
  );
};

export default HomePage;