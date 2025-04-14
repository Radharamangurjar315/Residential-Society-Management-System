import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  CircularProgress,
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Refresh as RefreshIcon,
  FilterAlt as FilterIcon 
} from '@mui/icons-material';
import VisitorCard from './VisitorCard';
import VisitorForm from './VisitorForm';
import VisitorFilter from './VisitorFilter';
import { getVisitors } from '../../components/utils/visitorApi';

export default function VisitorList({ societyId, userRole }) {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      const data = await getVisitors(societyId);
      setVisitors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisitors();
  }, [societyId]);

  const filteredVisitors = visitors.filter(visitor => {
    const matchesStatus = filters.status === 'all' || visitor.status === filters.status;
    const matchesSearch = visitor.visitorName.toLowerCase().includes(filters.search.toLowerCase()) ||
                         visitor.flatNumber.toLowerCase().includes(filters.search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRefresh = () => {
    fetchVisitors();
  };

  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box className="space-y-6">
      <Paper className="p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Typography variant="h5" className="font-bold text-gray-800">
            Visitor Management
          </Typography>
          
          <div className="flex items-center space-x-2">
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} disabled={loading}>
                <RefreshIcon className={loading ? 'animate-spin' : ''} />
              </IconButton>
            </Tooltip>
            
            <VisitorFilter 
              filters={filters} 
              setFilters={setFilters} 
            />
            
            <VisitorForm 
              societyId={societyId} 
              onSuccess={fetchVisitors} 
            />
          </div>
        </div>
      </Paper>

      {loading ? (
        <Box className="flex justify-center py-12">
          <CircularProgress />
        </Box>
      ) : filteredVisitors.length === 0 ? (
        <Paper className="p-8 text-center">
          <Typography variant="h6" className="text-gray-500">
            No visitors found
          </Typography>
        </Paper>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVisitors.map(visitor => (
            <VisitorCard 
              key={visitor._id} 
              visitor={visitor} 
              userRole={userRole} 
              onUpdate={fetchVisitors}
            />
          ))}
        </div>
      )}
    </Box>
  );
}