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
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  useTheme,
  alpha,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
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

// Notification type enum
const NotificationType = {
  REMINDER: 'REMINDER',
  ERROR: 'ERROR',
  INFO: 'INFO',
} as const;

// Notification status enum
const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED',
} as const;

// Notification channel enum
const NotificationChannel = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH',
} as const;

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedChannel, setSelectedChannel] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const theme = useTheme();

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      try {
        await api.delete(`/notifications/${id}`);
        setNotifications(notifications.filter(notification => notification.id !== id));
      } catch (err) {
        console.error('Error deleting notification:', err);
        setError('Failed to delete notification');
      }
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

  const filteredAndSortedNotifications = notifications
    .filter((notification) => {
      const matchesSearch = searchQuery === "" || 
        notification.documentTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = selectedType === "" || notification.type === selectedType;
      const matchesStatus = selectedStatus === "" || notification.status === selectedStatus;
      const matchesChannel = selectedChannel === "" || notification.channel === selectedChannel;
      
      return matchesSearch && matchesType && matchesStatus && matchesChannel;
    })
    .sort((a, b) => {
      const dateA = new Date(a.scheduledAt).getTime();
      const dateB = new Date(b.scheduledAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleSortToggle = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        width: '100%',
        height: '100%',
        p: 3
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%',
      minHeight: '100%',
      p: { xs: 2, md: 3 },
      backgroundColor: alpha(theme.palette.primary.main, 0.04),
    }}>
      <Box sx={{ 
        maxWidth: '100%',
        margin: '0 auto',
      }}>
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4 
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <NotificationsIcon /> Notifications
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Search notifications"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by document title..."
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={selectedType}
                    label="Type"
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {Object.values(NotificationType).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    label="Status"
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    {Object.values(NotificationStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Channel</InputLabel>
                  <Select
                    value={selectedChannel}
                    label="Channel"
                    onChange={(e) => setSelectedChannel(e.target.value)}
                  >
                    <MenuItem value="">All Channels</MenuItem>
                    {Object.values(NotificationChannel).map((channel) => (
                      <MenuItem key={channel} value={channel}>
                        {channel}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleSortToggle}
                  startIcon={sortDirection === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                  sx={{
                    height: '56px',
                    borderRadius: 1,
                    borderColor: theme.palette.divider,
                  }}
                >
                  Sort by Date
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <List>
            {filteredAndSortedNotifications.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No notifications"
                  secondary="You're all caught up!"
                />
              </ListItem>
            ) : (
              filteredAndSortedNotifications.map((notification, index) => (
                <Box key={notification.id}>
                  {index > 0 && <Divider />}
                  <ListItem
                    sx={{
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) }
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(notification.id)}
                        sx={{ color: theme.palette.error.main }}
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
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                          <Typography
                            component="span"
                            variant="subtitle1"
                            sx={{ fontWeight: 500, color: theme.palette.text.primary }}
                          >
                            {notification.documentTitle}
                          </Typography>
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
                            sx={{ fontWeight: 500 }}
                          />
                          <Chip
                            icon={<EmailIcon />}
                            label={notification.channel}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.15),
                              color: theme.palette.primary.dark,
                              fontWeight: 500
                            }}
                          />
                          <Chip
                            label={notification.status}
                            size="small"
                            color={notification.status === 'PENDING' ? 'warning' : 'success'}
                            sx={{ fontWeight: 500 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.secondary"
                            sx={{ display: 'block' }}
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
                            {notification.sentAt && (
                              <>
                                {' • '}
                                <span style={{ color: theme.palette.success.main }}>
                                  Sent at: {formatDate(notification.sentAt)}
                                </span>
                              </>
                            )}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>
              ))
            )}
          </List>
        </Card>
      </Box>
    </Box>
  );
};

export default Notifications;
