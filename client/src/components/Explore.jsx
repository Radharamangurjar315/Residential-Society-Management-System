import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function ActionAreaCard() {
  // Ref to track component mounting
  const mounted = React.useRef(false);

  // Effect to handle resize observer cleanup
  React.useEffect(() => {
    mounted.current = true;
    
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleCardClick = (cardName) => {
    if (!mounted.current) return;
    
    switch(cardName) {
      case 'POLLS':
        console.log('Polls clicked');
        window.location.href = '/polls';
        break;
      case 'NOTICES':
        console.log('Notices clicked');
        window.location.href = '/notices';
        break;
      case 'EVENTS':
        console.log('Events clicked');
        window.location.href = '/events';
        break;
      case 'MAINTENANCE AND BILLS':
        console.log('Bills clicked');
        window.location.href = '/bills';
        break;
      case 'Media Upload':
        console.log('Media upload clicked');
        window.location.href = '/adminupload';
        break;
      case 'Media Gallery':
        console.log('Gallery clicked');
        window.location.href = '/mediagallery';
        break;
      case 'File a Complaint':
        console.log('Complaints clicked');
        window.location.href = '/filecomplaint';
        break;
      default:
        break;
    }
  };

  const cards = [
    {
      image: "https://media.istockphoto.com/id/1531141530/vector/exit-polling-icon-vector-illustration-eps-10.jpg?s=612x612&w=0&k=20&c=pxgaIH18e1nSFvhOv9TnCuJ5ZD_vYTK7SMu30UkSswI=",
      title: "POLLS",
      description: "Lets Vote!!"
    },
    {
      image: "https://img.freepik.com/premium-vector/notice-free-vector_734448-5.jpg?semt=ais_hybrid",
      title: "NOTICES",
      description: "Get all the updates!!"
    },
    {
      image: "https://thumbs.dreamstime.com/b/calendar-events-isolated-special-red-round-button-abstract-illustration-calendar-events-special-red-round-button-104734032.jpg",
      title: "EVENTS",
      description: "Stay Updated!!"
    },
    {
      image: "https://thumbs.dreamstime.com/b/pay-bills-20875243.jpg",
      title: "MAINTENANCE AND BILLS",
      description: "Pay your bills online easily and securely!!"
    },
    {
      image: "https://thumbs.dreamstime.com/b/pay-bills-20875243.jpg",
      title: "Media Upload",
      description: "Pay your bills online easily and securely!!"
    },
    {
      image: "https://thumbs.dreamstime.com/b/pay-bills-20875243.jpg",
      title: "Media Gallery",
      description: "Pay your bills online easily and securely!!"
    },
    {
      image: "https://thumbs.dreamstime.com/b/pay-bills-20875243.jpg",
      title: "File a Complaint",
      description: "Pay your bills online easily and securely!!"
    },
  ];

  return (
    <Box 
    sx={{ 
      flexGrow: 1, 
      p: 2,
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      height: 'calc(100vh - 80px)', // Adjust for taskbar height (modify 80px as needed)
      overflowY: 'auto'  // Enable vertical scrolling if needed
    }}
  >
  

      <Grid 
        container 
        spacing={2}
        // Add stable heights to prevent resize loops
        sx={{
          '& .MuiGrid-item': {
            display: 'flex'
          }
        }}
      >
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} lg={3} key={index}>
            <Card 
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                // Use fixed height or min-height to prevent resize loops
                minHeight: '400px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
            >
              <CardActionArea 
                onClick={() => handleCardClick(card.title)}
                sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch'
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: 200,  //  height
                    objectFit: 'cover'
                  }}
                  image={card.image}
                  alt={card.title}
                />
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    gutterBottom 
                    variant="h5" 
                    component="div" 
                    align="center"
                    sx={{ flexGrow: 1 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    align="center"
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}