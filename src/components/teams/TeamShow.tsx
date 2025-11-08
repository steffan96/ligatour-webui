import { Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function TeamShow() {
  const { TeamId } = useParams();
  
  return (
    <div>
      <Typography variant="h4">Team Details: {TeamId}</Typography>
    </div>
  );
}