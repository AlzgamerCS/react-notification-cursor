import { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/login_background.jpg";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // TODO: Implement password reset functionality
      setSuccess(true);
    } catch (err) {
      setError("Failed to send password reset email. Please try again.");
    } finally {
      setIsSubmitting(false);
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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "10px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography component="h1" variant="h5" gutterBottom>
          Reset Password
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}

        {success ? (
          <Box sx={{ width: "100%", textAlign: "center" }}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Password reset instructions have been sent to your email.
            </Alert>
            <Button onClick={() => navigate("/login")}>
              Return to Login
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Reset Password"}
            </Button>
            <Button
              fullWidth
              onClick={() => navigate("/login")}
              sx={{ mt: 1 }}
            >
              Back to Login
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
