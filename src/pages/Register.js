import React, { useState } from 'react';
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

import AuthService from '../services';
import {
  nameValidationError,
  emailValidationError,
  passwordValidationError,
  formValidates
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

    if (formValidates(validationErrors)) {
      setLoading(true);
      submit({ name, email, password, password_confirmation: passwordConfirm });
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
    <Container maxWidth="sm">
      <Paper elevation={3}>
        <Box p={4} pb={3}>
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
                <div>
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
                </div>
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
                <div>
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
                    error={validationErrors.passwordConfirm !== false}
                    helperText={validationErrors.passwordConfirm}
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
