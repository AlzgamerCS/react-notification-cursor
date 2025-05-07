import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail, resendVerification, clearError, logout } from '../store/slices/authSlice';
import type { AppDispatch, RootState } from '../store';
import backgroundImage from '../assets/login_background.jpg';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, user } = useSelector((state: RootState) => state.auth);
  const [token, setToken] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    return () => {
      dispatch(clearError());
    };
  }, [user, navigate, dispatch]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [countdown]);

  useEffect(() => {
    let redirectTimer: NodeJS.Timeout;
    if (verificationSuccess) {
      redirectTimer = setTimeout(() => {
        dispatch(logout());
        navigate('/login');
      }, 3000);
    }
    return () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [verificationSuccess, navigate, dispatch]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length !== 6) {
      return;
    }
    const result = await dispatch(verifyEmail({ token }));
    if (!result.error) {
      setVerificationSuccess(true);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;
    
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    
    await dispatch(resendVerification({ email: user.email }));
  };

  if (verificationSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100vw',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#f5f5f5',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '450px',
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: '10px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
            position: 'relative',
            zIndex: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            Email verification successful!
          </Alert>
          <Typography variant="body1" align="center" gutterBottom>
            Your email has been verified. You will be redirected to the login page in a few seconds...
          </Typography>
          <Typography variant="body2" align="center" color="textSecondary">
            You can now log in using your email and password.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f5f5',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '450px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: '10px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          <strong>Verify Your Email</strong>
        </Typography>
        <Typography
          component="h2"
          variant="subtitle2"
          align="center"
          gutterBottom
          sx={{ mb: 2 }}
        >
          Please enter the 6-digit code sent to your email
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleVerify}
          sx={{ mt: 1, width: '90%' }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="token"
            label="Verification Code"
            name="token"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
            disabled={isLoading}
            inputProps={{
              maxLength: 6,
              pattern: '[0-9]*',
            }}
            helperText={token.length > 0 && token.length < 6 ? 'Please enter all 6 digits' : ' '}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            disabled={isLoading || token.length !== 6}
          >
            {isLoading ? <CircularProgress size={24} /> : 'Verify Email'}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              onClick={handleResend}
              disabled={resendDisabled || isLoading}
              sx={{ textTransform: 'none' }}
            >
              {countdown > 0
                ? `Resend code in ${countdown}s`
                : "Didn't receive the code? Resend"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyEmail; 