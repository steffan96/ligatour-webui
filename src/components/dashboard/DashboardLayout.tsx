import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      {/* Your sidebar/navigation would go here */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
