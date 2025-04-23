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
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Dashboard as DashboardIcon,
  Notifications,
  Description,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import type { AppDispatch, RootState } from "../store";

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
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed" color="primary">
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
              <Avatar alt={user?.name || "User"} src="/path/to/profile-pic.jpg">
                {user?.name?.charAt(0) || "U"}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
                Settings
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
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
