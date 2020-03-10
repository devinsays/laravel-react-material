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
import {
  passwordValidationError,
  passwordConfirmValidationError
} from '../utils/validation.js';
import Loader from '../components/Loader';

function ForgotPassword(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState();
  const [passwordConfirm, setPasswordConfirm] = useState();
  const [validationErrors, setValidationErrors] = useState({
    password: false,
    passwordConfirm: false
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

    if (name === 'password') {
      setPassword({ value });
      return;
    }

    if (name === 'passwordConfirm') {
      setPasswordConfirm({ value });
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

    if (name === 'password') {
      setPassword(value);
      validationError = passwordValidationError(value);
    }

    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      validationError = passwordValidationError(value);
      // Ensures password and passwordConfirm match.
      if (validationError === false && password !== value) {
        validationError = 'Password confirmation does not match password.';
      }
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
      password: passwordValidationError(password),
      passwordConfirm: passwordConfirmValidationError(passwordConfirm, password)
    };

    // Compares the objects to see if validation messages have changed.
    const validates = isEqual(validationErrors, errors);

    if (validates) {
      setLoading(true);
      submit({
        password,
        password_confirmation: passwordConfirm
      });
    } else {
      setValidationErrors({ ...errors });
    }
  };

  const getResetId = () => {
    const params = new URLSearchParams(props.location.search);
    if (params.has('id')) {
      return params.get('id');
    }
    return '';
  };

  const getResetToken = () => {
    const params = new URLSearchParams(props.location.search);
    if (params.has('token')) {
      return params.get('token');
    }
    return '';
  };

  const submit = credentials => {
    const payload = {
      id: getResetId(),
      token: getResetToken(),
      ...credentials
    };
    props
      .dispatch(AuthService.updatePassword(payload))
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
        <title>Reset Password | Laravel Material</title>
      </Helmet>
      <Container maxWidth="sm">
        <Typography component="h3" variant="h3" align="center">
          Reset Your Password
        </Typography>
        <Paper elevation={3}>
          <Box p={4} pb={3}>
            {success && (
              <MuiAlert severity="success">
                Your password has been reset!
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
                      name="password"
                      label="Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      variant="filled"
                      fullWidth
                      error={validationErrors.email !== false}
                      helperText={validationErrors.email}
                      type="password"
                    />
                  </div>
                  <div>
                    <TextField
                      name="passwordConfirm"
                      label="Confirm Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      variant="filled"
                      fullWidth
                      error={validationErrors.password !== false}
                      helperText={validationErrors.password}
                      type="password"
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
