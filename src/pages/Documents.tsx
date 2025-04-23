import { useState } from "react";
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
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { format } from "date-fns";

// Mock data
const initialDocuments = [
  {
    id: "1",
    title: "Business License",
    description: "Company business operation license",
    category: "Legal",
    tags: ["important", "legal", "business"],
    expirationDate: "2024-12-31",
    status: "ACTIVE",
  },
  {
    id: "2",
    title: "Insurance Policy",
    description: "Company liability insurance",
    category: "Insurance",
    tags: ["insurance", "liability"],
    expirationDate: "2024-06-15",
    status: "WARNING",
  },
  {
    id: "3",
    title: "Health Certificate",
    description: "Employee health certification",
    category: "Health",
    tags: ["health", "certification"],
    expirationDate: "2024-03-01",
    status: "EXPIRED",
  },
];

const Documents = () => {
  const [documents, setDocuments] = useState(initialDocuments);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success";
      case "WARNING":
        return "warning";
      case "EXPIRED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {/* TODO: Implement document creation */}}
        >
          Add Document
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document.id}>
                <TableCell>{document.title}</TableCell>
                <TableCell>{document.description}</TableCell>
                <TableCell>{document.category}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {document.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ backgroundColor: '#f0f0f0' }}
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
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => {/* TODO: Implement document editing */}}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(document.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Documents;
