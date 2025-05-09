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
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
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
      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden'
      }}>
        <AppBar 
          position="fixed" 
          elevation={1}
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'primary.main'
          }}
        >
          <Toolbar sx={{ justifyContent: "space-between", px: 3 }}>
            {/* Left-side navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/dashboard"
                color="secondary"
                startIcon={<DashboardIcon />}
                sx={{ textTransform: "none" }}
              >
                Dashboard
              </Button>
            </Box>

            {/* Right-side navigation */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                component={Link}
                to="/documents"
                color="secondary"
                startIcon={<Description />}
                sx={{ textTransform: "none" }}
              >
                Documents
              </Button>
              <Button
                component={Link}
                to="/notifications"
                color="secondary"
                startIcon={<Notifications />}
                sx={{ textTransform: "none" }}
              >
                Notifications
              </Button>
              <IconButton 
                onClick={handleMenuOpen} 
                sx={{ 
                  ml: 2,
                  width: 40,
                  height: 40
                }}
              >
                <Avatar 
                  alt={user?.name || "User"} 
                  src="/path/to/profile-pic.jpg"
                  sx={{ width: 32, height: 32 }}
                >
                  {user?.name?.charAt(0) || "U"}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    mt: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    minWidth: 180,
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem 
                  component={Link} 
                  to="/profile" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  Profile
                </MenuItem>
                <MenuItem 
                  component={Link} 
                  to="/settings" 
                  onClick={handleMenuClose}
                  sx={{ py: 1.5 }}
                >
                  Settings
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5,
                    color: 'error.main',
                    '&:hover': {
                      backgroundColor: 'error.lighter',
                    }
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: '100%',
            mt: '64px', // Height of AppBar
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default MainLayout;
