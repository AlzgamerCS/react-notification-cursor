import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Alert,
  Paper,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { addHours } from 'date-fns';
import { CloudUpload } from '@mui/icons-material';
import api, { ENDPOINTS, handleApiError } from '../services/api';
import { alpha } from '@mui/material/styles';

// Document category enum matching backend
const DocumentCategory = {
  CONTRACT: 'CONTRACT',
  LICENSE: 'LICENSE',
  CERTIFICATION: 'CERTIFICATION',
  PERMIT: 'PERMIT',
  AGREEMENT: 'AGREEMENT',
  OTHER: 'OTHER',
} as const;

// Document status enum matching backend
const DocumentStatus = {
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  ARCHIVED: 'ARCHIVED',
} as const;

const AddDocument = () => {
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [expirationDate, setExpirationDate] = useState<Date | null>(null);
  const [status, setStatus] = useState('ACTIVE');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState('');
  const [createCalendarEvent, setCreateCalendarEvent] = useState(false);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setError('');
    setUploadedFilePath('');

    const formData = new FormData();
    formData.append('files', file);

    try {
      setUploading(true);
      const response = await api.post(ENDPOINTS.DOCUMENTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!Array.isArray(response.data) || response.data.length === 0) {
        throw new Error('Invalid response from server');
      }

      setUploadedFilePath(response.data[0].fileName);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('File upload error:', err);
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!uploadedFilePath) {
      setError('Please upload a file first');
      return;
    }

    if (createCalendarEvent && !expirationDate) {
      setError('Please set expiration date for the calendar event');
      return;
    }

    const documentData = {
      title,
      description,
      category,
      expirationDate: expirationDate?.toISOString().split('T')[0],
      status,
      filePath: uploadedFilePath,
      tags,
      ...(createCalendarEvent && expirationDate && {
        calendarEventDetails: {
          createCalendarEvent,
          summary: title,
          description: description,
          startDateTime: expirationDate.toISOString(),
          endDateTime: addHours(expirationDate, 1).toISOString(),
          timeZone: 'GMT+5'
        }
      })
    };

    try {
      setLoading(true);
      const endpoint = createCalendarEvent ? 'documents/with-event' : ENDPOINTS.DOCUMENTS.CREATE;
      await api.post(endpoint, documentData);
      setSuccess(true);
      navigate('/documents')
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Document creation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100%',
        display: 'flex',
        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
      }}
    >
      {/* Left Panel - Header and Alerts */}
      <Box
        sx={{
          width: { xs: '100%', md: '300px' },
          p: 3,
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'white',
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          gap: 2,
          position: 'sticky',
          top: 0,
          height: 'fit-content',
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary">
          Add New Document
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Fill in the document details and upload your file to create a new document.
        </Typography>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ width: '100%' }}>Document created successfully!</Alert>}
        
        <Box sx={{ mt: 'auto' }}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || !uploadedFilePath || !title || !category || !expirationDate}
            onClick={handleSubmit}
          >
            {loading ? 'Creating...' : 'Create Document'}
          </Button>
        </Box>
      </Box>

      {/* Mobile Header */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          width: '100%',
          p: 3,
          bgcolor: 'white',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
          Add New Document
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Fill in the document details and upload your file to create a new document.
        </Typography>

        {(error || success) && (
          <Box sx={{ mt: 2 }}>
            {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ width: '100%' }}>Document created successfully!</Alert>}
          </Box>
        )}
      </Box>

      {/* Right Panel - Form */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                inputProps={{ maxLength: 255 }}
                helperText={`${title.length}/255 characters`}
                error={title.length === 255}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  required
                >
                  {Object.entries(DocumentCategory).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{key}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={3}
                inputProps={{ maxLength: 255 }}
                helperText={`${description.length}/255 characters`}
                error={description.length === 255}
              />
            </Grid>

            {/* Tags Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Add Tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput) {
                    e.preventDefault();
                    if (tags.length >= 10) {
                      setError('Maximum 10 tags allowed');
                      return;
                    }
                    if (tagInput.length > 50) {
                      setError('Tag length cannot exceed 50 characters');
                      return;
                    }
                    if (!tags.includes(tagInput)) {
                      setTags([...tags, tagInput]);
                      setTagInput('');
                      setError('');
                    }
                  }
                }}
                helperText={`Press Enter to add tag. ${tags.length}/10 tags used.`}
              />
              {tags.length > 0 && (
                <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      onDelete={() => setTags(tags.filter(t => t !== tag))}
                    />
                  ))}
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Date and Status */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Expiration Date"
                  value={expirationDate}
                  onChange={(newValue) => setExpirationDate(newValue)}
                  sx={{ width: '100%' }}
                  minDate={new Date()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="Status"
                  required
                >
                  {Object.entries(DocumentStatus).map(([key, value]) => (
                    <MenuItem key={key} value={value}>{key}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={createCalendarEvent}
                    onChange={(e) => setCreateCalendarEvent(e.target.checked)}
                  />
                }
                label="Add expiration reminder to calendar"
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Paper
                sx={{
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  textAlign: 'center',
                }}
              >
                <input
                  accept="*/*"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    disabled={uploading}
                    startIcon={<CloudUpload />}
                  >
                    {uploading ? 'Uploading...' : 'Choose File'}
                  </Button>
                </label>
                
                {selectedFile && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Selected: {selectedFile.name}
                    {uploading && ' (Uploading...)'}
                  </Typography>
                )}
                
                {uploadedFilePath && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    File uploaded successfully!
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Mobile Submit Button */}
          <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !uploadedFilePath || !title || !category || !expirationDate}
              onClick={handleSubmit}
            >
              {loading ? 'Creating...' : 'Create Document'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default AddDocument; 