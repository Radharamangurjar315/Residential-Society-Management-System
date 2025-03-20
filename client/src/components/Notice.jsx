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
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userRole, setUserRole] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserRole(parsedUser.role);
      console.log("Fetched User Role:", parsedUser.role);
    }
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notices");
        const data = await response.json();
        setNotices(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      }
    };
    
    fetchNotices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userRole !== "admin") {
      alert("Access Denied! Only admins can add notices.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found. User must be logged in.");
      return;
    }

    if (!title.trim() || !content.trim()) return;

    const newNotice = {
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await fetch("http://localhost:5000/api/notices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newNotice),
      });

      const data = await response.json();
      if (response.ok) {
        setNotices(prev => [data, ...prev]);
        setTitle('');
        setContent('');
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error("Error adding notice:", data.message);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
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
  
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      overflowX: 'hidden',
      px: { xs: 1, sm: 2, md: 3 },
      py: { xs: 2, md: 3 }
    }}>
      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ width: '100%', margin: 0 }}>
        {/* Notice Creation Form */}
        <Grid item xs={12} md={4} sx={{ 
          width: '100%', 
          paddingLeft: '0 !important',
          paddingRight: { xs: '0 !important', md: `${theme.spacing(3)} !important` },
          order: { xs: 2, md: 1 }
        }}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                Create New Notice
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Notice Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  size={isMobile ? "small" : "medium"}
                />
                <TextField
                  fullWidth
                  label="Notice Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={isMobile ? 3 : 4}
                  size={isMobile ? "small" : "medium"}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    mt: 2,
                    py: { xs: 1, md: 1.5 } 
                  }}
                >
                  Post Notice
                </Button>
              </form>
            </CardContent>
          </Card>

          {showSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Notice posted successfully!
            </Alert>
          )}
        </Grid>

        {/* Notices Display */}
        <Grid item xs={12} md={8} sx={{ 
          width: '100%', 
          paddingLeft: '0 !important', 
          paddingRight: '0 !important',
          order: { xs: 1, md: 2 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: { xs: 1.5, md: 2 },
            width: '100%',
            overflowX: 'hidden'
          }}>
            {notices.length === 0 ? (
              <Paper elevation={1} sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
                <Typography color="textSecondary">
                  No notices yet. Create one to get started!
                </Typography>
              </Paper>
            ) : (
              notices.map(notice => (
                <Card 
                  key={notice.id} 
                  elevation={2}
                  sx={{
                    border: notice.isPinned ? '1px solid #2196f3' : 'none',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    '&:hover': {
                      boxShadow: 3,
                    }
                  }}
                >
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start',
                      flexDirection: { xs: isMobile ? 'column' : 'row', sm: 'row' },
                      gap: { xs: 1, sm: 0 },
                      mb: 1.5,
                      width: '100%'
                    }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        flexWrap: 'wrap',
                        maxWidth: { xs: '100%', sm: '80%' }
                      }}>
                        <Typography 
                          variant="h6" 
                          component="div"
                          sx={{ 
                            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word'
                          }}
                        >
                          {notice.title}
                        </Typography>
                        {notice.isPinned && (
                          <Chip 
                            label="Pinned" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                            sx={{ height: { xs: 20, sm: 24 } }}
                          />
                        )}
                      </Box>
                      <Box sx={{ 
                        alignSelf: { xs: isMobile ? 'flex-end' : 'flex-start' },
                        flexShrink: 0 
                      }}>
                        <IconButton 
                          onClick={() => togglePin(notice._id)}
                          color={notice.isPinned ? "primary" : "default"}
                          size={isMobile ? "small" : "medium"}
                        >
                          <PushPinIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDelete(notice._id)}
                          color="error"
                          size={isMobile ? "small" : "medium"}
                        >
                          <DeleteIcon fontSize={isMobile ? "small" : "medium"} />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        mb: 2,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        width: '100%'
                      }}
                    >
                      {notice.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AccessTimeIcon sx={{ fontSize: { xs: '0.75rem', sm: 'small' }, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                        {notice.date}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NoticePage;