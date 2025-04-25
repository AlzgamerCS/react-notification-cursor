import { useState } from 'react';
import {
  Box,
  Button,
  Container,
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
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';
import { addHours } from 'date-fns';
import api, { ENDPOINTS, handleApiError } from '../services/api';

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
  
  // Calendar event state
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

  // Handle tag input
  const handleTagInputKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && tagInput) {
      event.preventDefault();
      if (!tags.includes(tagInput)) {
        setTags([...tags, tagInput]);
      }
      setTagInput('');
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
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Document
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Document created successfully! Redirecting...
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              required
              fullWidth
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              inputProps={{ maxLength: 255 }}
              helperText={`${title.length}/255 characters`}
              error={title.length === 255}
            />

            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
              inputProps={{ maxLength: 255 }}
              helperText={`${description.length}/255 characters`}
              error={description.length === 255}
            />

            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                label="Category"
              >
                {Object.entries(DocumentCategory).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, mb: 2 }}>
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
                helperText={`Enter to add tag. Maximum 10 tags, 50 characters each. ${tags.length}/10 tags used.`}
                error={tags.length >= 10 || tagInput.length > 50}
                inputProps={{ maxLength: 50 }}
              />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => {
                      setTags(tags.filter((t) => t !== tag));
                      setError('');
                    }}
                  />
                ))}
              </Box>
            </Box>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ mb: 2 }}>
                <DatePicker
                  label="Expiration Date"
                  value={expirationDate}
                  onChange={(newValue) => setExpirationDate(newValue)}
                  sx={{ width: '100%' }}
                  minDate={new Date()}
                />
              </Box>

              <FormControlLabel
                control={
                  <Switch
                    checked={createCalendarEvent}
                    onChange={(e) => setCreateCalendarEvent(e.target.checked)}
                  />
                }
                label="Add expiration reminder to calendar"
                sx={{ mb: 2 }}
              />
            </LocalizationProvider>

            <FormControl fullWidth margin="normal" variant="outlined">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                label="Status"
              >
                {Object.entries(DocumentStatus).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <input
                accept="*/*"
                style={{ display: 'none' }}
                id="file-upload"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button 
                  variant="contained" 
                  component="span"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </label>
              {selectedFile && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {selectedFile.name}
                  {uploading && ' (Uploading...)'}
                </Typography>
              )}
              {uploadedFilePath && (
                <Alert severity="success" sx={{ mt: 1 }}>
                  File uploaded successfully!
                </Alert>
              )}
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || !uploadedFilePath || !title || !category || !expirationDate}
              >
                {loading ? 'Creating...' : 'Create Document'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AddDocument; 