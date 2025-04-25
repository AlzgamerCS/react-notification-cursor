import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Email as EmailIcon,
} from '@mui/icons-material';

interface Notification {
  id: string;
  userId: string;
  documentId: string;
  documentTitle: string;
  documentStatus: string;
  channel: string;
  type: string;
  scheduledAt: string;
  sentAt: string | null;
  status: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications/my');
        setNotifications(response.data);
        setError(null);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Please login to view notifications');
        } else {
          setError('Failed to fetch notifications');
        }
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (err) {
      console.error('Error deleting notification:', err);
      // Optionally show an error message to the user
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'REMINDER':
        return <WarningIcon color="warning" />;
      case 'ERROR':
        return <WarningIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
        <Typography>Loading notifications...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <NotificationsIcon /> Notifications
      </Typography>

      <Paper elevation={2}>
        <List>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No notifications"
                secondary="You're all caught up!"
              />
            </ListItem>
          ) : (
            notifications.map((notification, index) => (
              <Box key={notification.id}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemIcon>
                    {getNotificationIcon(notification.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {notification.documentTitle}
                        <Chip
                          label={notification.type}
                          size="small"
                          color={
                            notification.type === 'ERROR'
                              ? 'error'
                              : notification.type === 'REMINDER'
                              ? 'warning'
                              : 'info'
                          }
                        />
                        <Chip
                          icon={<EmailIcon />}
                          label={notification.channel}
                          size="small"
                          color="default"
                        />
                        <Chip
                          label={notification.status}
                          size="small"
                          color={notification.status === 'PENDING' ? 'warning' : 'success'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                        >
                          Document Status: {notification.documentStatus}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          Scheduled for: {formatDate(notification.scheduledAt)}
                          {notification.sentAt && ` • Sent at: ${formatDate(notification.sentAt)}`}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Box>
            ))
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default Notifications;
