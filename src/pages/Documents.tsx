import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Container,
  Card,
  CardContent,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Notifications as NotificationsIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
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

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  const theme = useTheme();

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      try {
        await api.delete(ENDPOINTS.DOCUMENTS.DELETE(id));
        setDocuments(documents.filter(doc => doc.id !== id));
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        console.error('Delete error:', err);
      }
    }
  };

  const handleDownload = async (filePath: string, title: string) => {
    try {
      const response = await api.get(ENDPOINTS.DOCUMENTS.DOWNLOAD(filePath), {
        responseType: 'blob'
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(response.data);
      
      // Extract extension from filePath
      const extension = filePath.split('.').pop() || '';
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title}.${extension}`;
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error('Download error:', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "EXPIRED":
        return "error";
      case "ARCHIVED":
        return "default";
      default:
        return "default";
    }
  };

  const filteredAndSortedDocuments = documents
    .filter((doc) => {
      const matchesSearch = searchQuery === "" || 
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "" || doc.category === selectedCategory;
      const matchesStatus = selectedStatus === "" || doc.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.expirationDate).getTime();
      const dateB = new Date(b.expirationDate).getTime();
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
              color: theme.palette.text.primary 
            }}
          >
            My Documents
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => navigate('/documents/add')}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Add Document
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card sx={{ mb: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Search documents"
                  variant="outlined"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title or description..."
                  InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Category"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {Object.values(DocumentCategory).map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
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
                    {Object.values(DocumentStatus).map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
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
                  Sort by Expiration
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 2 }}>
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Tags</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Expiration Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', backgroundColor: alpha(theme.palette.primary.main, 0.04), whiteSpace: 'nowrap' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedDocuments.map((document) => (
                  <TableRow 
                    key={document.id}
                    sx={{ '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{document.title}</TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary }}>{document.description}</TableCell>
                    <TableCell>
                      <Chip
                        label={document.category}
                        size="small"
                        sx={{ 
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          color: theme.palette.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {document.tags.map((tag) => (
                          <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                            }}
                          />
                        ))}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {format(new Date(document.expirationDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={document.status}
                        color={getStatusColor(document.status)}
                        sx={{ minWidth: 85 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {document.filePath && (
                          <Tooltip title="Download">
                            <IconButton
                              size="small"
                              onClick={() => handleDownload(document.filePath!, document.title)}
                              sx={{ color: theme.palette.primary.main }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {/* TODO: Implement document editing */}}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Add Reminder">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/reminders/add/${document.id}`, { 
                              state: { documentTitle: document.title } 
                            })}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <NotificationsIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(document.id)}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Card>
      </Box>
    </Box>
  );
};

export default Documents;
