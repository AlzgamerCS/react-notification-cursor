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
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

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
    setUploadedFilePath(''); // Clear previous upload path

    const formData = new FormData();
    formData.append('files', file);

    try {
      setUploading(true);
      const response = await fetch('http://localhost:8080/api/files/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'File upload failed');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid response from server');
      }

      // Use the fileName from the first uploaded file
      setUploadedFilePath(data[0].fileName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file. Please try again.');
      console.error('File upload error:', err);
      setSelectedFile(null); // Clear selected file on error
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

    const documentData = {
      title,
      description,
      category,
      expirationDate: expirationDate?.toISOString().split('T')[0],
      status,
      filePath: uploadedFilePath,
      tags
    };

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/v1/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        throw new Error('Failed to create document');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/documents');
      }, 2000);
    } catch (err) {
      setError('Failed to create document. Please try again.');
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

            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
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
              <DatePicker
                label="Expiration Date"
                value={expirationDate}
                onChange={(newValue) => setExpirationDate(newValue)}
                sx={{ mt: 2, mb: 2, width: '100%' }}
                minDate={new Date()} // Prevent past dates
              />
            </LocalizationProvider>

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              >
                {Object.entries(DocumentStatus).map(([key, value]) => (
                  <MenuItem key={key} value={value}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2, mb: 2 }}>
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
              {error && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {error}
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