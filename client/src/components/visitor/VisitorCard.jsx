import { 
  Card, 
  CardContent, 
  CardHeader, 
  Avatar, 
  Typography, 
  Divider,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon,
  Home as HomeIcon,
  Schedule as ScheduleIcon,
  ExitToApp as ExitIcon
} from '@mui/icons-material';
import StatusChip from './StatusChip';
import VisitorActions from './VisitorActions';

export default function VisitorCard({ visitor, userRole, onUpdate }) {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader
        avatar={
          <Avatar className="bg-blue-100 text-blue-600">
            <PersonIcon />
          </Avatar>
        }
        title={
          <Typography variant="h6" className="font-semibold">
            {visitor.visitorName}
          </Typography>
        }
        subheader={
          <StatusChip status={visitor.status} />
        }
      />
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2">
          <HomeIcon className="text-gray-500" />
          <Typography>Flat: {visitor.flatNumber}</Typography>
        </div>
        
        <Typography className="text-gray-700">
          {visitor.purpose}
        </Typography>
        
        <Divider className="my-2" />
        
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ScheduleIcon fontSize="small" />
          <Typography variant="body2">
            {formatDate(visitor.entryTime)}
          </Typography>
        </div>
        
        {visitor.exitTime && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ExitIcon fontSize="small" />
            <Typography variant="body2">
              {formatDate(visitor.exitTime)}
            </Typography>
          </div>
        )}
      </CardContent>
      
      <div className="p-3 bg-gray-50">
        <VisitorActions 
          visitor={visitor} 
          userRole={userRole} 
          onUpdate={onUpdate}
        />
      </div>
    </Card>
  );
}