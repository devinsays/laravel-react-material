import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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
  nameValidationError,
  emailValidationError,
  passwordValidationError,
  passwordConfirmValidationError
} from '../utils/validation.js';
import Loader from '../components/Loader';

function Register(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    name: false,
    email: false,
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

    if (name === 'name') {
      setName(value);
      return;
    }

    if (name === 'email') {
      setEmail(value);
      return;
    }

    if (name === 'password') {
      setPassword(value);
      return;
    }

    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
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

    if (name === 'name') {
      setName(value);
      validationError = nameValidationError(value);
    }

    if (name === 'email') {
      setEmail(value);
      validationError = emailValidationError(value);
    }

    if (name === 'password') {
      setPassword(value);
      validationError = passwordValidationError(value);
    }

    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      validationError = passwordConfirmValidationError(value, password);
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
      name: nameValidationError(name),
      email: emailValidationError(email),
      password: passwordValidationError(password),
      passwordConfirm: passwordConfirmValidationError(passwordConfirm, password)
    };

    // Compares the objects to see if validation messages have changed.
    const validates = isEqual(validationErrors, errors);

    if (validates) {
      setLoading(true);
      submit({ name, email, password, password_confirmation: passwordConfirm });
    } else {
      setValidationErrors({ ...errors });
    }
  };

  const submit = credentials => {
    props
      .dispatch(AuthService.register(credentials))
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

  // If user is already authenticated we redirect to entry location.
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    const { from } = props.location.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  return (
    <>
      <Helmet>
        <title>Register | Laravel Material</title>
      </Helmet>
      <Container maxWidth="sm">
        <Box mb={3}>
          <Typography component="h3" variant="h3" align="center">
            Register for the App
          </Typography>
        </Box>
        <Paper elevation={3}>
          <Box pt={2} pr={4} pb={4} pl={4}>
            {success && (
              <MuiAlert severity="success">
                Registration successful.
                <Link to="/" href="/">
                  Please log in with your new email and password.
                </Link>
              </MuiAlert>
            )}
            {!success && (
              <form noValidate autoComplete="off" onSubmit={handleSubmit}>
                {response.error && (
                  <MuiAlert severity="error">{response.message}</MuiAlert>
                )}
                <Box mb={3}></Box>
                <Box mb={2}>
                  <Box mb={2}>
                    <TextField
                      name="name"
                      label="Full Name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      variant="filled"
                      fullWidth
                      error={validationErrors.name !== false}
                      helperText={validationErrors.name}
                    />
                  </Box>
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
                  <Box mb={2}>
                    <TextField
                      name="passwordConfirm"
                      label="Confirm Password"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={loading}
                      variant="filled"
                      fullWidth
                      error={validationErrors.passwordConfirm !== false}
                      helperText={validationErrors.passwordConfirm}
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
                  >
                    {!loading && <span>Register</span>}
                    {loading && <Loader />}
                  </Button>
                </Box>
                <Typography variant="body2" align="center">
                  Already have an account? <Link to="/login">Log in</Link>.
                </Typography>
              </form>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Register);
