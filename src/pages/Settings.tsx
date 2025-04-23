import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    language: 'en',
  });

  const handleToggleChange = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSettings(prev => ({
      ...prev,
      language: event.target.value,
    }));
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <List>
          <ListItem>
            <ListItemText
              primary="Email Notifications"
              secondary="Receive email notifications about document expiration"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.emailNotifications}
                onChange={() => handleToggleChange('emailNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive push notifications in your browser"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.pushNotifications}
                onChange={() => handleToggleChange('pushNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Dark Mode"
              secondary="Use dark theme across the application"
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={settings.darkMode}
                onChange={() => handleToggleChange('darkMode')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />
          <ListItem>
            <FormControl fullWidth>
              <InputLabel id="language-select-label">Language</InputLabel>
              <Select
                labelId="language-select-label"
                value={settings.language}
                label="Language"
                onChange={handleLanguageChange}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="es">Español</MenuItem>
                <MenuItem value="fr">Français</MenuItem>
                <MenuItem value="de">Deutsch</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        </List>
      </Paper>

      <Typography variant="body2" color="text.secondary" align="center">
        Note: These are demo settings and are not persisted.
      </Typography>
    </Box>
  );
};

export default Settings; 