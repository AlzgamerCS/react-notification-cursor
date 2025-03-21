import { Box, Grid, Paper, Typography } from '@mui/material';
import { useState } from 'react';

// Mock data
const mockDocuments = [
  {
    id: 1,
    name: 'Business License',
    expiryDate: '2024-06-15',
    status: 'urgent',
    daysUntilExpiry: 15,
  },
  {
    id: 2,
    name: 'Insurance Policy',
    expiryDate: '2024-08-20',
    status: 'soon',
    daysUntilExpiry: 45,
  },
  {
    id: 3,
    name: 'Health Certificate',
    expiryDate: '2024-12-31',
    status: 'good',
    daysUntilExpiry: 120,
  },
];

const Dashboard = () => {
  const [documents] = useState(mockDocuments);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent':
        return '#ff1744';
      case 'soon':
        return '#ffab00';
      case 'good':
        return '#00c853';
      default:
        return '#757575';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#ffebee',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Urgent Renewals
            </Typography>
            <Typography variant="h3" component="div">
              {documents.filter(doc => doc.status === 'urgent').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Documents requiring immediate attention
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#fff3e0',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Upcoming Renewals
            </Typography>
            <Typography variant="h3" component="div">
              {documents.filter(doc => doc.status === 'soon').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Documents expiring soon
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
              bgcolor: '#e8f5e9',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Valid Documents
            </Typography>
            <Typography variant="h3" component="div">
              {documents.filter(doc => doc.status === 'good').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Documents in good standing
            </Typography>
          </Paper>
        </Grid>

        {/* Recent Documents */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Documents
            </Typography>
            {documents.map(doc => (
              <Box
                key={doc.id}
                sx={{
                  p: 2,
                  mb: 1,
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="subtitle1">{doc.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expires: {doc.expiryDate}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: getStatusColor(doc.status),
                    fontWeight: 'bold',
                  }}
                >
                  {doc.daysUntilExpiry} days remaining
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 