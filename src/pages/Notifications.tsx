import { useState } from 'react';
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
} from '@mui/icons-material';

// Mock data
const initialNotifications = [
  {
    id: 1,
    title: 'Document Expiring Soon',
    message: 'Business License will expire in 15 days',
    type: 'warning',
    timestamp: '2024-03-20T10:00:00',
  },
  {
    id: 2,
    title: 'New Document Added',
    message: 'Insurance Policy has been added to your documents',
    type: 'info',
    timestamp: '2024-03-19T15:30:00',
  },
  {
    id: 3,
    title: 'Urgent: Document Expired',
    message: 'Health Certificate has expired',
    type: 'error',
    timestamp: '2024-03-18T09:15:00',
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
                        {notification.title}
                        <Chip
                          label={notification.type}
                          size="small"
                          color={
                            notification.type === 'error'
                              ? 'error'
                              : notification.type === 'warning'
                              ? 'warning'
                              : 'info'
                          }
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        {notification.message}
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: 'block' }}
                        >
                          {formatDate(notification.timestamp)}
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
