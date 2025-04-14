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
        window.location.href = '/maintenanceform';
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
        case 'Complaints Dashboard':
        console.log('Complaints');
        window.location.href = '/admincomplaints';
        break;
        case 'Contacts Directory':
        window.location.href = '/contacts';
        break;
        case 'Visitor Form':
        window.location.href = '/visitorform';
        break;
        case 'Visitor List':
        window.location.href = '/visitorlist';
        break;
        case 'Visitor Card':
        window.location.href = '/visitorcard';
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
      image: "https://t4.ftcdn.net/jpg/05/65/22/41/360_F_565224180_QNRiRQkf9Fw0dKRoZGwUknmmfk51SuSS.jpg",
      title: "Media Upload",
      description: "Upload your media easily and securely!!"
    },
    {
      image: "https://media.istockphoto.com/id/1493434989/photo/150-individual-personalities-collage.jpg?s=612x612&w=0&k=20&c=llR17KeI9vsu7Rb_WaItj6cidJA2QhiTN32_j-kJB6I=",
      title: "Media Gallery",
      description: "See all the media!!"
    },
    {
      image: "https://cms-prod.s3.ap-south-1.amazonaws.com/How_To_File_A_Complaint_Against_An_Insurance_Company_In_India_Beshak_1c7b5e94d4.png",
      title: "File a Complaint",
      description: "File a complaint easily and securely!!"
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQMTVg0dJg2ZDepbphSCup8mJQ2-p-7quxATw&s",
      title: "Complaints Dashboard",
      description: "See all the complaints!!"
    },
    {
      image: "https://media.istockphoto.com/id/956261774/vector/contact-book-icon-vector.jpg?s=612x612&w=0&k=20&c=KXO7oPuhTVPKIHCyFjC4SwzZlnjDmfn66GVoqkviDFc=",
      title: "Contacts Directory",
      description: "Get all the contacts!!"
    },
    {
      image: "https://www.shutterstock.com/image-vector/visitor-icon-vector-isolated-on-260nw-2045904857.jpg",
      title: "Visitor Form",
      description: "Fill the visitor form!!"
    },
    {
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR7sTHqLWByi3mtxed7L5hDSNMKysC56KIKVg&s",
      title: "Visitor List",
      description: "See all the visitors!!"
    },
    {
      image: "https://t3.ftcdn.net/jpg/04/75/01/62/360_F_475016277_uAsyHtSrdSWQMgTRNEsV8PLvDKEbEFXm.jpg",
      title: "Visitor Card",
      description: "See all the visitor cards!!"
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