import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/login_background.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(formData.email, formData.password);
      console.log("Routing to the dashboard...");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError("Failed to login. Please check your credentials and try again.");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: "450px",
          height: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "10px",
          boxShadow:
            "0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)",
          position: "relative",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          <strong>Log In to Automated Notification System</strong>
        </Typography>
        <Typography
          component="h2"
          variant="subtitle2"
          align="center"
          gutterBottom
        >
          Securely manage document expirations and notifications
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "90%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link
              href="/forgot-password"
              variant="body2"
              onClick={(e) => {
                e.preventDefault();
                navigate("/forgot-password");
              }}
            >
              Can't log in?
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
