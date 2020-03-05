import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEmail from 'validator/es/lib/isEmail';
import { makeStyles } from '@material-ui/core/styles';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import AuthService from '../services';

function ForgotPassword(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [response, setResponse] = useState({
    error: false,
    message: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
      if (emailError) {
        setEmailError(null);
      }
      return;
    }
  };

  const handleBlur = e => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === '') {
      return;
    }

    if (name === 'email') {
      setEmail(value);
      validateEmail(value);
      return;
    }
  };

  const validateEmail = (value = email) => {
    if (!isEmail(value)) {
      setEmailError('The email field must be a valid email.');
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    // If validation passes, submit.
    const emailValidates = validateEmail();

    if (emailValidates) {
      setLoading(true);
      submit({ email });
    }
  };

  const submit = credentials => {
    props
      .dispatch(AuthService.resetPassword(credentials))
      .then(() => {
        setLoading(false);
        setSuccess(true);
      })
      .catch(err => {
        const errors = Object.values(err.errors);
        errors.join(' ');
        const response = {
          error: true,
          message: errors
        };
        setResponse(response);
        setLoading(false);
      });
  };

  // Styles.
  const classes = useStyles();

  return (
    <Container maxWidth="sm">
      <Typography component="h3" variant="h3" align="center">
        Request Password Reset
      </Typography>
      <Paper elevation={3}>
        <Box p={4} pb={3}>
          {success && (
            <MuiAlert severity="success">
              A password reset link has been sent!
            </MuiAlert>
          )}
          {!success && (
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              {response.error && (
                <MuiAlert severity="error">{response.message}</MuiAlert>
              )}
              <Box mb={3}></Box>
              <Box mb={2}>
                <div>
                  <TextField
                    name="email"
                    label="Email Address"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={loading}
                    variant="filled"
                    fullWidth
                    error={emailError !== null}
                    helperText={emailError}
                  />
                </div>
              </Box>
              <Box mb={2}>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  fullWidth
                  type="submit"
                >
                  {!loading && <span>Send Password Reset Email</span>}
                  {loading && (
                    <CircularProgress
                      size={24}
                      thickness={4}
                      className={classes.loader}
                    />
                  )}
                </Button>
              </Box>
            </form>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

const useStyles = makeStyles(() => ({
  loader: {
    color: '#fff'
  }
}));

ForgotPassword.defaultProps = {
  location: {
    state: {
      pathname: '/'
    }
  }
};

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    state: {
      pathname: PropTypes.string
    }
  })
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(ForgotPassword);
