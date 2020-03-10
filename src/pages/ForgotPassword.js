import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import isEqual from 'lodash/isEqual';

import AuthService from '../services';
import { emailValidationError } from '../utils/validation.js';
import Loader from '../components/Loader';

function ForgotPassword(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState();
  const [validationErrors, setValidationErrors] = useState({
    email: false
  });
  const [response, setResponse] = useState({
    error: false,
    message: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    // Remove existing validation error for field.
    // We'll do a fresh validation check on blur or submission.
    if (name in validationErrors) {
      setValidationErrors({ ...validationErrors, [name]: false });
    }

    if (name === 'email') {
      setEmail({ value });
    }
  };

  const handleBlur = e => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === '') {
      return;
    }

    let validationError = false;

    if (name === 'email') {
      setEmail(value);
      validationError = emailValidationError(value);
    }

    // Set the validation error if validation failed.
    if (validationError !== false) {
      setValidationErrors({ ...validationErrors, [name]: validationError });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Runs final form validation.
    const errors = {
      email: emailValidationError(email)
    };

    // Compares the objects to see if validation messages have changed.
    const validates = isEqual(validationErrors, errors);

    if (validates) {
      setLoading(true);
      submit({ email });
    } else {
      setValidationErrors({ ...errors });
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

  return (
    <>
      <Helmet>
        <title>Forgot Password | Laravel Material</title>
      </Helmet>
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
                  <Box mb={3}>
                    <MuiAlert severity="error">{response.message}</MuiAlert>
                  </Box>
                )}
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
                      error={validationErrors.email !== false}
                      helperText={validationErrors.email}
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
                    {loading && <Loader />}
                  </Button>
                </Box>
              </form>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

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
