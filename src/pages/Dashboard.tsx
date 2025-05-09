import { Box, Grid, Paper, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import api, { ENDPOINTS, handleApiError } from '../services/api';

interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  expirationDate: string;
  filePath: string | null;
  status: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get<Document[]>(ENDPOINTS.DOCUMENTS.LIST);
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (daysUntilExpiry: number) => {
    if (daysUntilExpiry <= 15) return '#ff1744'; // urgent
    if (daysUntilExpiry <= 45) return '#ffab00'; // soon
    return '#00c853'; // good
  };

  const getDocumentStatus = (expirationDate: string) => {
    const today = new Date();
    const expiry = new Date(expirationDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 15) return 'urgent';
    if (daysUntilExpiry <= 45) return 'soon';
    return 'good';
  };

  const getDocumentsWithStatus = (status: string) => {
    return documents.filter(doc => getDocumentStatus(doc.expirationDate) === status);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
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
              {getDocumentsWithStatus('urgent').length}
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
              {getDocumentsWithStatus('soon').length}
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
              {getDocumentsWithStatus('good').length}
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
            {documents
              .sort((a, b) => new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime())
              .slice(0, 5)
              .map(doc => {
                const today = new Date();
                const expiry = new Date(doc.expirationDate);
                const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
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
                      <Typography variant="subtitle1">{doc.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expires: {new Date(doc.expirationDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: getStatusColor(daysUntilExpiry),
                        fontWeight: 'bold',
                      }}
                    >
                      {daysUntilExpiry} days remaining
                    </Typography>
                  </Box>
                );
              })}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 