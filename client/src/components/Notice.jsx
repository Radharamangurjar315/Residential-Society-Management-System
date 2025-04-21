import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { alpha } from '@mui/material/styles';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import { format } from 'date-fns';

function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [societyId, setSocietyId] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;
        const parsedUser = JSON.parse(storedUser);
        setUserRole(parsedUser.role);
        setSocietyId(parsedUser.societyId);
    
        if (!parsedUser.societyId) return;
    
        const token = localStorage.getItem("token");
        if (!token) return;
    
        // Ensure the URL and query parameters are correct
        const response = await axios.get(`http://localhost:5000/api/notices`, {
          headers: { "Authorization": `Bearer ${token}` },
          params: { societyId: parsedUser.societyId }, // Correctly passing societyId as a query parameter
        });
    
        setNotices(response.data);
      } catch (error) {
        console.error("Error fetching notices:", error);
        setNotices([]);
      }
    };

    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userRole !== "admin" || !title.trim() || !content.trim() || !societyId) return;

    try {
      const token = localStorage.getItem("token");
      const newNotice = { title, content, societyId, date: new Date().toISOString() };
      const response = await axios.post("http://localhost:5000/api/notices", newNotice, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      setNotices([response.data, ...notices]);
      setTitle('');
      setContent('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error adding notice:", error);
    }
  };

  const togglePin = (id) => {
    setNotices(prev => prev.map(notice => 
      notice._id === id ? { ...notice, isPinned: !notice.isPinned } : notice
    ).sort((a, b) => Number(b.isPinned) - Number(a.isPinned)));
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Notice ID is undefined");
      return;
    }
  
    if (userRole !== "admin") {
      alert("Access Denied! Only admins can delete notices.");
      return;
    }
  
    const confirmDelete = window.confirm("Are you sure you want to delete this notice?");
    if (!confirmDelete) return;
  
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
  
      const response = await fetch(`http://localhost:5000/api/notices/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert("Notice deleted successfully!");
        setNotices((prevNotices) => prevNotices.filter(notice => notice._id !== id));
      } else {
        alert(`Failed to delete: ${data.message}`);
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy 'at' h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%',
      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.background.default, 0.9) : alpha(theme.palette.background.default, 0.9),
      minHeight: '100vh',
      pt: { xs: 2, sm: 3, md: 4 },
      pb: { xs: 6, sm: 8, md: 10 },
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: { xs: 3, md: 4 }, 
          fontWeight: 700,
          textAlign: { xs: 'center', md: 'left' },
          fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: { xs: 'center', md: 'flex-start' },
          gap: 1.5
        }}
      >
        <NotificationsActiveIcon sx={{ 
          fontSize: { xs: '1.75rem', sm: '2.125rem', md: '2.5rem' },
          color: theme.palette.primary.main
        }} />
        Notice Board
      </Typography>

      <Grid container spacing={{ xs: 3, md: 4 }} sx={{ maxWidth: '1500px', mx: 'auto' }}>
        {/* Form Section */}
        <Grid item xs={12} md={4} sx={{ order: { xs: 2, md: 1 } }}>
          <Slide direction="right" in={true} timeout={600}>
            <Card elevation={3} sx={{ 
              height: '100%', 
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              backdropFilter: 'blur(10px)',
              backgroundColor: alpha(theme.palette.background.paper, 0.8),
              position: 'sticky',
              top: { xs: 'auto', md: '1rem' }
            }}>
              <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2.5, 
                    fontWeight: 600,
                    fontSize: { xs: '1.25rem', md: '1.35rem' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Avatar sx={{ 
                    bgcolor: theme.palette.primary.main,
                    width: 32,
                    height: 32
                  }}>
                    <NotificationsActiveIcon fontSize="small" />
                  </Avatar>
                  Create New Notice
                </Typography>
                
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Notice Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    placeholder="Enter a descriptive title"
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Notice Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    variant="outlined"
                    multiline
                    rows={isMobile ? 4 : 6}
                    placeholder="Write your notice details here..."
                    InputProps={{
                      sx: { borderRadius: 1.5 }
                    }}
                    sx={{ mb: 3 }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    disabled={userRole !== 'admin'}
                    sx={{ 
                      mt: 1, 
                      py: 1.5,
                      borderRadius: 1.5,
                      fontWeight: 600,
                      boxShadow: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      '&:hover': {
                        boxShadow: 4,
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Post Notice
                  </Button>
                  
                  {userRole !== 'admin' && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, textAlign: 'center' }}>
                      Only administrators can post notices
                    </Typography>
                  )}
                </form>

                <Fade in={showSuccess} timeout={700}>
                  <Alert 
                    severity="success" 
                    sx={{ 
                      mt: 2.5, 
                      borderRadius: 1.5,
                      display: showSuccess ? 'flex' : 'none'
                    }}
                  >
                    Notice posted successfully!
                  </Alert>
                </Fade>
              </CardContent>
            </Card>
          </Slide>
        </Grid>

        {/* Notices Display */}
        <Grid item xs={12} md={8} sx={{ order: { xs: 1, md: 2 } }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 2.5, md: 3 },
            width: '100%'
          }}>
            {notices.length === 0 ? (
              <Zoom in={true} timeout={500}>
                <Paper elevation={2} sx={{ 
                  p: { xs: 3, md: 5 }, 
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
                }}>
                  <NotificationsActiveIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.5), mb: 2 }} />
                  <Typography color="textSecondary" variant="h6" sx={{ fontWeight: 500 }}>
                    No notices available
                  </Typography>
                  <Typography color="textSecondary" variant="body2" sx={{ mt: 1 }}>
                    {userRole === 'admin' ? 'Create the first notice using the form' : 'Check back later for updates'}
                  </Typography>
                </Paper>
              </Zoom>
            ) : (
              notices.map((notice, index) => (
                <Fade key={notice._id || index} in={true} timeout={300 + index * 100}>
                  <Card 
                    elevation={notice.isPinned ? 4 : 2}
                    sx={{
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: notice.isPinned ? `2px solid ${theme.palette.primary.main}` : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.3s ease',
                      backgroundColor: notice.isPinned ? alpha(theme.palette.primary.main, 0.03) : alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: theme.shadows[6],
                      }
                    }}
                  >
                    <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: { xs: 1.5, sm: 0 },
                        mb: 2,
                        width: '100%'
                      }}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 1.5,
                          flexWrap: 'wrap',
                          maxWidth: { xs: '100%', sm: '75%' }
                        }}>
                          <Typography 
                            variant="h6" 
                            component="div"
                            sx={{ 
                              fontSize: { xs: '1.1rem', sm: '1.2rem', md: '1.3rem' },
                              fontWeight: 600,
                              wordBreak: 'break-word',
                              overflowWrap: 'break-word',
                              color: notice.isPinned ? theme.palette.primary.main : theme.palette.text.primary
                            }}
                          >
                            {notice.title}
                          </Typography>
                          {notice.isPinned && (
                            <Chip 
                              icon={<PushPinIcon fontSize="small" />}
                              label="Pinned" 
                              size="small" 
                              color="primary" 
                              sx={{ 
                                borderRadius: '4px',
                                height: { xs: 24, sm: 28 },
                                backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}
                            />
                          )}
                        </Box>
                        <Box sx={{ 
                          alignSelf: { xs: 'flex-end', sm: 'flex-start' },
                          display: 'flex',
                          ml: { xs: 0, sm: 2 }
                        }}>
                          <IconButton 
                            onClick={() => togglePin(notice._id)}
                            color={notice.isPinned ? "primary" : "default"}
                            size={isMobile ? "small" : "medium"}
                            sx={{ 
                              mr: 1,
                              backgroundColor: notice.isPinned ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                              '&:hover': {
                                backgroundColor: notice.isPinned ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.action.hover, 0.8)
                              }
                            }}
                            disabled={userRole !== 'admin'}
                          >
                            <PushPinIcon fontSize={isMobile ? "small" : "small"} />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDelete(notice._id)}
                            color="error"
                            size={isMobile ? "small" : "medium"}
                            sx={{ 
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.2)
                              }
                            }}
                            disabled={userRole !== 'admin'}
                          >
                            <DeleteIcon fontSize={isMobile ? "small" : "small"} />
                          </IconButton>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          whiteSpace: 'pre-wrap',
                          mb: 3,
                          fontSize: { xs: '0.9rem', sm: '1rem' },
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          lineHeight: 1.7,
                          color: alpha(theme.palette.text.primary, 0.9)
                        }}
                      >
                        {notice.content}
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        color: 'text.secondary',
                        bgcolor: alpha(theme.palette.background.default, 0.5),
                        p: 1,
                        borderRadius: 1
                      }}>
                        <AccessTimeIcon sx={{ fontSize: { xs: '0.8rem', sm: 'small' }, mr: 1, color: theme.palette.text.secondary }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontSize: { xs: '0.75rem', sm: '0.8rem' },
                            fontWeight: 500,
                            color: alpha(theme.palette.text.secondary, 0.9)
                          }}
                        >
                          {formatDate(notice.date)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NoticePage;