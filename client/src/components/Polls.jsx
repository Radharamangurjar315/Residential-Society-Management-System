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
  Chip
} from '@mui/material';
import { PlusCircle, Trash2, Timer, Users, Calendar, CheckCircle, XCircle, CheckSquare } from 'lucide-react';

const PollSystem = () => {
  const [polls, setPolls] = useState([]);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', ''],
    duration: 60
  });
  const [error, setError] = useState('');
  const userId = 'user123'; 

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/polls');
      const data = await response.json();
      setPolls(data);
    } catch (error) {
      setError('Failed to fetch polls');
    }
  };

  const createPoll = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/polls/create', {
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
    } catch (error) {
      setError('Failed to create poll');
    }
  };

  const deletePoll = async (pollId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/polls/${pollId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchPolls();
      }
    } catch (error) {
      setError('Failed to delete poll');
    }
  };

  const votePoll = async (pollId, optionIndex) => {
    try {
      const response = await fetch(`http://localhost:3000/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, optionIndex })
      });
      if (response.ok) {
        fetchPolls();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      setError('Failed to cast vote');
    }
  };

  const addOption = () => {
    setNewPoll(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = value;
    setNewPoll(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  const isPollActive = (poll) => {
    const endTime = new Date(poll.createdAt).getTime() + poll.duration * 60000;
    return Date.now() <= endTime;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getUserVote = (poll) => {
    if (!poll.voters) return null;
    return poll.voters.find(voter => voter.userId === userId);
  };

  const getRemainingTime = (poll) => {
    const endTime = new Date(poll.createdAt).getTime() + poll.duration * 60000;
    const remaining = endTime - Date.now();
    if (remaining <= 0) return 'Ended';
    
    const minutes = Math.floor(remaining / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h remaining`;
    if (hours > 0) return `${hours}h ${minutes % 60}m remaining`;
    return `${minutes}m remaining`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Create Poll Form */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Create New Poll
        </Typography>
        <Box component="form" onSubmit={createPoll} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Poll Question"
            value={newPoll.question}
            onChange={(e) => setNewPoll(prev => ({ ...prev, question: e.target.value }))}
            margin="normal"
            required
          />
          
          {newPoll.options.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => updateOption(index, e.target.value)}
              margin="normal"
              required
            />
          ))}
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              onClick={addOption}
              startIcon={<PlusCircle />}
            >
              Add Option
            </Button>
            <TextField
              type="number"
              label="Duration (minutes)"
              value={newPoll.duration}
              onChange={(e) => setNewPoll(prev => ({ ...prev, duration: e.target.value }))}
              sx={{ width: 150 }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Poll
          </Button>
        </Box>
      </Paper>

      {/* Poll List */}
      <Typography variant="h5" gutterBottom>
        Active Polls
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {polls.map(poll => {
          const userVote = getUserVote(poll);
          const isActive = isPollActive(poll);

          return (
            <Card key={poll._id} variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">{poll.question}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    {userVote && (
                      <Chip 
                        icon={<CheckSquare size={16} />}
                        label={`You voted: ${poll.options[userVote.optionIndex].text}`}
                        color="primary"
                        size="small"
                      />
                    )}
                    <IconButton
                      color="error"
                      onClick={() => deletePoll(poll._id)}
                    >
                      <Trash2 />
                    </IconButton>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  {poll.options.map((option, index) => {
                    const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                    const percentage = totalVotes > 0 ? (option.votes / totalVotes * 100).toFixed(1) : 0;
                    const isUserVote = userVote?.optionIndex === index;
                    
                    return (
                      <Box key={index} sx={{ mb: 1 }}>
                        <Button
                          fullWidth
                          variant={isUserVote ? "contained" : "outlined"}
                          onClick={() => votePoll(poll._id, index)}
                          disabled={!isActive || userVote}
                          sx={{ 
                            justifyContent: 'space-between', 
                            mb: 1,
                            bgcolor: isUserVote ? 'primary.main' : 'transparent'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isUserVote && <CheckSquare size={16} />}
                            <Typography variant="body1">{option.text}</Typography>
                          </Box>
                          <Typography variant="body2">
                            {option.votes} votes ({percentage}%)
                          </Typography>
                        </Button>
                        <LinearProgress 
                          variant="determinate" 
                          value={parseFloat(percentage)} 
                          sx={{ 
                            height: 8, 
                            borderRadius: 1,
                            backgroundColor: isUserVote ? 'primary.light' : undefined
                          }}
                        />
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Calendar size={16} />
                    <Typography variant="body2">
                      Created: {formatDate(poll.createdAt)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Timer size={16} />
                    <Typography variant="body2">
                      {isActive ? (
                        <Box component="span" sx={{ color: 'success.main', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <CheckCircle size={16} /> {getRemainingTime(poll)}
                        </Box>
                      ) : (
                        <Box component="span" sx={{ color: 'error.main', display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
                          <XCircle size={16} /> Ended
                        </Box>
                      )}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Users size={16} />
                    <Typography variant="body2">
                      Total Votes: {poll.voters?.length || 0}
                    </Typography>
                  </Box>

                  {poll.voters && poll.voters.length > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Recent Voters:
                      </Typography>
                      {poll.voters.slice(-3).map((voter, index) => (
                        <Typography key={index} variant="body2" sx={{ ml: 2 }}>
                          • {voter.userId === userId ? 'You' : voter.userId} - Option {voter.optionIndex + 1} ({formatDate(voter.votedAt)})
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default PollSystem;