import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  Home,
  Dashboard as DashboardIcon,
  Notifications,
  Description,
} from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#fb9455",
    },
    secondary: {
      main: "#ffffff",
    },
  },
});

const MainLayout = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static" color="primary">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Left-side navigation */}
          <Box>
            <Button
              component={Link}
              to="/"
              color="inherit"
              startIcon={<Home />}
              sx={{ textTransform: "none" }}
            >
              Home
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              color="inherit"
              startIcon={<DashboardIcon />}
              sx={{ textTransform: "none" }}
            >
              Dashboard
            </Button>
          </Box>

          {/* Right-side navigation */}
          <Box>
            <Button
              component={Link}
              to="/documents"
              color="inherit"
              startIcon={<Description />}
              sx={{ textTransform: "none" }}
            >
              Documents
            </Button>
            <Button
              component={Link}
              to="/notifications"
              color="inherit"
              startIcon={<Notifications />}
              sx={{ textTransform: "none" }}
            >
              Notifications
            </Button>
            <IconButton onClick={handleMenuOpen} sx={{ ml: 2 }}>
              <Avatar alt="User Profile" src="/path/to/profile-pic.jpg" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
              <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
              <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          display: "flex",
          minWidth: "100vw",
        }}
      >
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
