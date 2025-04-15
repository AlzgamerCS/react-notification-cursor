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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";

// Mock data
const mockDocuments = [
  {
    id: 1,
    name: "Business License",
    type: "License",
    department: "Operations",
    expiryDate: "2024-06-15",
    status: "urgent",
    assignedTo: "John Doe",
  },
  {
    id: 2,
    name: "Insurance Policy",
    type: "Insurance",
    department: "Legal",
    expiryDate: "2024-08-20",
    status: "soon",
    assignedTo: "Jane Smith",
  },
  {
    id: 3,
    name: "Health Certificate",
    type: "Certificate",
    department: "HR",
    expiryDate: "2024-12-31",
    status: "good",
    assignedTo: "Mike Johnson",
  },
];

const Documents = () => {
  const [documents] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "urgent":
        return "#ff1744";
      case "soon":
        return "#ffab00";
      case "good":
        return "#00c853";
      default:
        return "#757575";
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    Object.values(doc).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box sx={{ flexGrow: 1, pt: 8 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Documents</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Document
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search documents..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Expiry Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDocuments.map((doc) => (
              <TableRow key={doc.id} hover>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.department}</TableCell>
                <TableCell>{doc.expiryDate}</TableCell>
                <TableCell>
                  <Typography
                    component="span"
                    sx={{
                      color: getStatusColor(doc.status),
                      fontWeight: "bold",
                      textTransform: "capitalize",
                    }}
                  >
                    {doc.status}
                  </Typography>
                </TableCell>
                <TableCell>{doc.assignedTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Documents;
