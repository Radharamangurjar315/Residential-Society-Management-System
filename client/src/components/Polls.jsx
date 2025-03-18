import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  IconButton,
  LinearProgress,
  Paper,
  Divider,
  Container,
  Alert,
  Grid,
} from '@mui/material';
import { PlusCircle, Trash2 } from 'lucide-react';
import axios from 'axios';

const PollSystem = ({ user }) => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({ question: '', options: ['', ''], duration: 60 });
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5173/api/polls';

  useEffect(() => { fetchPolls(); }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://localhost:5173/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) { setError('Failed to fetch polls'); }
  };

  const createPoll = async (e) => {
    e.preventDefault();
    if (user.role !== 'admin') return setError('Only admins can create polls.');

    try {
      const response = await fetch('http://localhost:5173/api/polls/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newPoll.question,
          options: newPoll.options.map(option => ({ text: option, votes: 0 })),
          duration: parseInt(newPoll.duration)
        })
      });
      if (response.ok) {
        setNewPoll({ question: '', options: ['', ''], duration: 60 });
        fetchPolls();
      }
    } catch (error) { setError('Failed to create poll'); }
  };

  const deletePoll = async (pollId) => {
    try {
      await axios.delete(`http://localhost:5000/api/polls/${pollId}`);
      fetchPolls();
    } catch (error) {
      console.error("Error deleting poll:", error);
    }
  };
  
  const votePoll = async (pollId, optionIndex) => {
    if (!user || !user._id) {  // Change `id` to `_id`
      console.error("User ID is missing:", user);
      setError("User is not authenticated.");
      return;
    }

    try {
      console.log("Voting with:", { userId: user._id,userName: user.name, optionIndex }); // Change `id` to `_id`

      const response = await fetch(`http://localhost:5000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, optionIndex }) // Change `id` to `_id`
      });

      if (response.ok) {
        fetchPolls();  // Refresh poll data
      } else {
        const errorMessage = await response.json();
        console.error("Vote error:", errorMessage);
        setError(errorMessage.message);
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Failed to cast vote");
    }
};



  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      
      <Grid container spacing={4}>
        {/* Admin-Only Create Poll Section */}
        {user.role === 'admin' && (
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Create New Poll</Typography>
              <Box component="form" onSubmit={createPoll} sx={{ mt: 2 }}>
                <TextField fullWidth label="Poll Question" value={newPoll.question} onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })} margin="normal" required />
                {newPoll.options.map((option, index) => (
                  <TextField key={index} fullWidth label={`Option ${index + 1}`} value={option} onChange={(e) => {
                    const newOptions = [...newPoll.options];
                    newOptions[index] = e.target.value;
                    setNewPoll({ ...newPoll, options: newOptions });
                  }} margin="normal" required />
                ))}
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="outlined" onClick={() => setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })} startIcon={<PlusCircle />}>Add Option</Button>
                  <TextField type="number" label="Duration (minutes)" value={newPoll.duration} onChange={(e) => setNewPoll({ ...newPoll, duration: e.target.value })} sx={{ width: 150 }} />
                </Box>
                <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Create Poll</Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Active Polls Section */}
        <Grid item xs={12} md={user.role === 'admin' ? 6 : 12}>
          <Typography variant="h5" gutterBottom>Active Polls</Typography>
          <Grid container spacing={2} sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 1 }}>
            {polls.map(poll => (
              <Grid item xs={12} sm={6} key={poll._id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">{poll.question}</Typography>
                      {user.role === 'admin' && (
                        <IconButton color="error" onClick={() => deletePoll(poll._id)}><Trash2 /></IconButton>
                      )}
                    </Box>
                    {poll.options.map((option, index) => (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Button fullWidth variant="outlined" onClick={() => votePoll(poll._id, index)} sx={{ justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body1">{option.text}</Typography>
                          <Typography variant="body2">{option.votes} votes</Typography>
                        </Button>
                        <LinearProgress variant="determinate" value={option.votes} sx={{ height: 8, borderRadius: 1 }} />
                      </Box>
                    ))}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="text.secondary">Created: {new Date(poll.createdAt).toLocaleString()}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PollSystem;
