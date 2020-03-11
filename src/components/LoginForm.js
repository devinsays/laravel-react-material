import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { TextField, Button, Typography, Box, Paper } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import isEqual from 'lodash/isEqual';

import AuthService from '../services';
import {
  emailValidationError,
  passwordValidationError
} from '../utils/validation.js';
import Loader from './Loader';

function LoginForm(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [validationErrors, setValidationErrors] = useState({
    email: false,
    password: false
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
      setEmail(value);
      return;
    }

    if (name === 'password') {
      setPassword(value);
      return;
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

    if (name === 'password') {
      setPassword(value);
      validationError = passwordValidationError(value);
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
      email: emailValidationError(email),
      password: passwordValidationError(password)
    };

    // Compares the objects to see if validation messages have changed.
    const validates = isEqual(validationErrors, errors);

    if (validates) {
      setLoading(true);
      submit({ email, password });
    } else {
      setValidationErrors({ ...errors });
    }
  };

  const submit = credentials => {
    props.dispatch(AuthService.login(credentials)).catch(err => {
      const errors = Object.values(err.errors);
      errors.join(' ');
      const response = {
        error: true,
        message: errors
      };
      setResponse(response);
      setLoading(false);
      setEmail('');
      setPassword('');
    });
  };

  // If user is already authenticated we redirect to entry location.
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    const { from } = props.location?.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  return (
    <div>
      <Box mb={3}>
        <Typography component="h3" variant="h3" align="center">
          Log in to the App
        </Typography>
      </Box>

      <Paper elevation={3}>
        <Box p={4} pb={3}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            {response.error && (
              <Box mb={2}>
                <MuiAlert severity="error">{response.message}</MuiAlert>
              </Box>
            )}
            <Box mb={2}>
              <Box mb={2}>
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
              </Box>
              <Box mb={2}>
                <TextField
                  name="password"
                  label="Password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  variant="filled"
                  fullWidth
                  error={validationErrors.password !== false}
                  helperText={validationErrors.password}
                  type="password"
                />
              </Box>
            </Box>
            <Box mb={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                type="submit"
                disableElevation
              >
                {!loading && <span>Sign In</span>}
                {loading && <Loader />}
              </Button>
            </Box>
            <Typography variant="body2" align="center">
              Don't have an account? <Link to="/register">Register</Link>.
            </Typography>
          </form>
        </Box>
      </Paper>
      <Box mt={4}>
        <Typography align="center" variant="body2">
          <Link to="/forgot-password">Forgot Your Password?</Link>
        </Typography>
      </Box>
    </div>
  );
}

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(LoginForm);
