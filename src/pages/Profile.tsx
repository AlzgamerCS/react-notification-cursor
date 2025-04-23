import { Box, Paper, Typography, Avatar, Grid, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{ width: 120, height: 120, fontSize: '3rem' }}
              alt={user?.name || 'User'}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" gutterBottom>
              {user?.name}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              {user?.email}
            </Typography>
            <Typography variant="body2">
              Role: {user?.role}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Last Login
            </Typography>
            <Typography>
              {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'N/A'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Account Created
            </Typography>
            <Typography>
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile; 