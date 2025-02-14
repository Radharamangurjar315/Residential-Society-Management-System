// Notice.jsx
import React, { useState } from 'react';
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

function NoticePage() {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      const newNotice = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        date: new Date().toLocaleString(),
        isPinned: false
      };
      setNotices(prev => [newNotice, ...prev]);
      setTitle('');
      setContent('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const togglePin = (id) => {
    setNotices(prev => prev.map(notice => 
      notice.id === id ? { ...notice, isPinned: !notice.isPinned } : notice
    ).sort((a, b) => Number(b.isPinned) - Number(a.isPinned)));
  };

  const deleteNotice = (id) => {
    setNotices(prev => prev.filter(notice => notice.id !== id));
  };

  return (
    <Box sx={{ maxWidth: 'xl', mx: 'auto', p: 2 }}>
      <Grid container spacing={3}>
        {/* Notice Creation Form */}
        <Grid item xs={12} lg={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
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
                />
                <TextField
                  fullWidth
                  label="Notice Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  multiline
                  rows={4}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ mt: 2 }}
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
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {notices.length === 0 ? (
              <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
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
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6" component="div">
                          {notice.title}
                        </Typography>
                        {notice.isPinned && (
                          <Chip 
                            label="Pinned" 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        )}
                      </Box>
                      <Box>
                        <IconButton 
                          onClick={() => togglePin(notice.id)}
                          color={notice.isPinned ? "primary" : "default"}
                        >
                          <PushPinIcon />
                        </IconButton>
                        <IconButton 
                          onClick={() => deleteNotice(notice.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        whiteSpace: 'pre-wrap',
                        mb: 2 
                      }}
                    >
                      {notice.content}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <AccessTimeIcon sx={{ fontSize: 'small', mr: 0.5 }} />
                      <Typography variant="body2">
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