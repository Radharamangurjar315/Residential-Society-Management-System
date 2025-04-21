// src/pages/Visitors.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Container,
  Grid,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Slide
} from "@mui/material";
import { 
  AccessTime, 
  ExitToApp, 
  CheckCircle, 
  Cancel, 
  PersonAdd,
  Refresh
} from "@mui/icons-material";

const Visitors = () => {
  const token = localStorage.getItem("token");
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const societyId = user?.societyId;
  
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    flatNumber: "",
    visitorName: "",
    purpose: "",
  });

  const showSuccess = (message) => {
    setSuccess(message);
    setTimeout(() => setSuccess(""), 3000);
  };

  const showError = (message) => {
    setError(message);
    setTimeout(() => setError(""), 3000);
  };

  const fetchVisitors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/visitors/${user.societyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVisitors(res.data);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
      showError("Failed to load visitors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVisitor = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/visitors/add`,
        { ...form, societyId: user.societyId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setForm({ flatNumber: "", visitorName: "", purpose: "" });
      showSuccess("Visitor successfully registered!");
      fetchVisitors();
    } catch (err) {
      console.error("Create Error:", err.response?.data || err.message);
      showError("Failed to register visitor. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/visitors/status/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess(`Visitor ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
      fetchVisitors();
    } catch (err) {
      console.error("Status Update Error:", err.response?.data || err.message);
      showError("Failed to update visitor status");
    }
  };

  const markExit = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/visitors/exit/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Visitor exit recorded successfully");
      fetchVisitors();
    } catch (err) {
      console.error("Exit Error:", err.response?.data || err.message);
      showError("Failed to record visitor exit");
    }
  };

  useEffect(() => {
    if (societyId) {
      fetchVisitors();
    }
  }, [societyId]);

  // Helper function to determine status chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {error && (
        <Slide direction="down" in={!!error} mountOnEnter unmountOnExit>
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        </Slide>
      )}
      
      {success && (
        <Slide direction="down" in={!!success} mountOnEnter unmountOnExit>
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        </Slide>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            p: 4, 
            mb: 4, 
            borderRadius: 3,
            color: 'white'
          }}
        >
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Visitor Management
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Track and manage all society visitors in one place
          </Typography>
        </Paper>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            mb: 4, 
            borderRadius: 2,
            background: 'white',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
              transform: 'translateY(-4px)'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <PersonAdd sx={{ color: '#4F46E5', mr: 1.5 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
              Register New Visitor
            </Typography>
          </Box>
          
          <form onSubmit={handleAddVisitor}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Flat Number"
                  variant="outlined"
                  value={form.flatNumber}
                  onChange={(e) => setForm({ ...form, flatNumber: e.target.value })}
                  required
                  placeholder="e.g. A-101"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      '&:hover': {
                        borderColor: '#4F46E5'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Visitor Name"
                  variant="outlined"
                  value={form.visitorName}
                  onChange={(e) => setForm({ ...form, visitorName: e.target.value })}
                  required
                  placeholder="Full name"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      '&:hover': {
                        borderColor: '#4F46E5'
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Purpose"
                  variant="outlined"
                  value={form.purpose}
                  onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                  required
                  placeholder="e.g. Delivery, Meeting"
                  InputProps={{
                    sx: {
                      borderRadius: 1.5,
                      '&:hover': {
                        borderColor: '#4F46E5'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                type="submit" 
                variant="contained"
                size="large"
                startIcon={<PersonAdd />}
                sx={{
                  backgroundColor: '#4F46E5',
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)',
                  '&:hover': {
                    backgroundColor: '#4338CA',
                    boxShadow: '0 6px 20px rgba(79, 70, 229, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Register Visitor
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AccessTime sx={{ color: '#4F46E5', mr: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1F2937' }}>
            Visitor Records
          </Typography>
        </Box>
        <Tooltip title="Refresh visitor list">
          <IconButton 
            onClick={fetchVisitors} 
            disabled={loading}
            sx={{
              color: '#4F46E5',
              backgroundColor: 'rgba(79, 70, 229, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(79, 70, 229, 0.15)',
              }
            }}
          >
            <Refresh sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </IconButton>
        </Tooltip>
      </Box>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {visitors.length === 0 ? (
            <Grid item xs={12}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 6, 
                  textAlign: 'center', 
                  borderRadius: 2, 
                  backgroundColor: '#F9FAFB',
                  border: '1px dashed #D1D5DB'
                }}
              >
                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                  No visitors registered yet
                </Typography>
              </Paper>
            </Grid>
          ) : (
            visitors.map((visitor) => (
              <Grid item xs={12} md={6} lg={4} key={visitor._id}>
                <motion.div variants={itemVariants}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%', 
                      borderRadius: 2,
                      overflow: 'hidden',
                      border: '1px solid #E5E7EB',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        transform: 'translateY(-5px)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: 6, 
                        width: '100%', 
                        backgroundColor: visitor.status === 'approved' 
                          ? '#10B981' 
                          : visitor.status === 'rejected'
                            ? '#EF4444'
                            : '#F59E0B'
                      }} 
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
                          {visitor.visitorName}
                        </Typography>
                        <Chip 
                          label={visitor.status.charAt(0).toUpperCase() + visitor.status.slice(1)} 
                          color={getStatusColor(visitor.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            borderRadius: 1
                          }}
                        />
                      </Box>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4B5563', 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ fontWeight: 600, marginRight: 4 }}>Flat:</span> 
                          {visitor.flatNumber}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4B5563', 
                            mb: 1,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <span style={{ fontWeight: 600, marginRight: 4 }}>Purpose:</span> 
                          {visitor.purpose}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#4B5563', 
                            display: 'flex',
                            alignItems: 'center',
                            mb: visitor.exitTime ? 1 : 0
                          }}
                        >
                          <AccessTime fontSize="small" sx={{ mr: 1, color: '#4F46E5' }} />
                          <span style={{ fontWeight: 600, marginRight: 4 }}>Entry:</span> 
                          {new Date(visitor.entryTime).toLocaleString()}
                        </Typography>
                        
                        {visitor.exitTime && (
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#4B5563', 
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <ExitToApp fontSize="small" sx={{ mr: 1, color: '#4F46E5' }} />
                            <span style={{ fontWeight: 600, marginRight: 4 }}>Exit:</span> 
                            {new Date(visitor.exitTime).toLocaleString()}
                          </Typography>
                        )}
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        {user.role === 'resident' && visitor.status === 'pending' && (
                          <>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => updateStatus(visitor._id, 'approved')}
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
                                }
                              }}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => updateStatus(visitor._id, 'rejected')}
                              sx={{
                                borderRadius: 1.5,
                                fontWeight: 500,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
                                }
                              }}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {['admin', 'guard'].includes(user.role) && visitor.status === 'approved' && !visitor.exitTime && (
                          <Button 
                            size="small"
                            variant="contained"
                            startIcon={<ExitToApp />}
                            onClick={() => markExit(visitor._id)}
                            sx={{
                              backgroundColor: '#4F46E5',
                              borderRadius: 1.5,
                              fontWeight: 500,
                              '&:hover': {
                                backgroundColor: '#4338CA',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            Mark Exit
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>
      </motion.div>

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default Visitors;