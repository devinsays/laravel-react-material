import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

import AuthService from '../services';
import {
  emailValidationError,
  passwordValidationError
} from '../utils/validation.js';

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
      setEmail({ value });
      return;
    }

    if (name === 'password') {
      setPassword({ value });
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

    if (formValidates) {
      setLoading(true);
      submit({ email, password });
    }
  };

  // Checks all the values in the validationErrors object.
  // Returns true if there are no errors (i.e each value is false).
  const formValidates = () => {
    return Object.values(validationErrors).every(value => value === false);
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

  // Styles.
  const classes = useStyles();

  // If user is already authenticated we redirect to entry location.
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    const { from } = props.location?.state || { from: { pathname: '/' } };
    return <Redirect to={from} />;
  }

  return (
    <div>
      <Typography component="h3" variant="h3" align="center">
        Log in to the App
      </Typography>

      <Paper elevation={3}>
        <Box p={4} pb={3}>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            {response.error && (
              <Box mb={2}>
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
            </Box>
            <Box mb={2}>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
                type="submit"
              >
                {!loading && <span>Sign In</span>}
                {loading && (
                  <CircularProgress
                    size={24}
                    thickness={4}
                    className={classes.loader}
                  />
                )}
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

const useStyles = makeStyles(theme => ({
  loader: {
    color: theme.white
  }
}));

LoginForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(LoginForm);
