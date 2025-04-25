import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  TextField,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api, { ENDPOINTS, handleApiError } from '../services/api';

type Channel = 'EMAIL' | 'SMS' | 'IN_APP' | 'TELEGRAM';

const AddReminder = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [channel, setChannel] = useState<Channel>('EMAIL');
  const [scheduledAt, setScheduledAt] = useState<Date | null>(new Date());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) {
      setError('Please select a date and time');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(ENDPOINTS.NOTIFICATIONS.CREATE, {
        document: {
          id: documentId
        },
        channel: channel,
        type: 'INITIAL',
        scheduledAt: scheduledAt.toISOString(),
        status: 'PENDING'
      });

      navigate('/documents');
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Error creating reminder:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Reminder
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Notification Channel</InputLabel>
              <Select
                value={channel}
                label="Notification Channel"
                onChange={(e) => setChannel(e.target.value as Channel)}
              >
                <MenuItem value="EMAIL">Email</MenuItem>
                <MenuItem value="SMS">SMS</MenuItem>
                <MenuItem value="IN_APP">In-App</MenuItem>
                <MenuItem value="TELEGRAM">Telegram</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <DateTimePicker
                label="Scheduled Date & Time"
                value={scheduledAt}
                onChange={(newValue) => setScheduledAt(newValue)}
                disablePast
              />
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/documents')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
              >
                Add Reminder
              </Button>
            </Box>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default AddReminder; 