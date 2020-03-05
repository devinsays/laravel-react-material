import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
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

function Register(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);
  const [response, setResponse] = useState({
    error: false,
    message: ''
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === 'name') {
      setName(value);
      if (nameError) {
        setNameError(null);
      }
      return;
    }

    if (name === 'email') {
      setEmail(value);
      if (emailError) {
        setEmailError(null);
      }
      return;
    }

    if (name === 'password') {
      setPassword(value);
      if (passwordError) {
        setPasswordError(null);
      }
      return;
    }

    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      if (passwordConfirmError) {
        setPasswordConfirmError(null);
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

    if (name === 'name') {
      setName(value);
      validateName(value);
      return;
    }

    if (name === 'email') {
      setEmail(value);
      validateEmail(value);
      return;
    }

    if (name === 'password') {
      setPassword(value);
      validatePassword(value);
      return;
    }

    if (name === 'passwordConfirm') {
      setPasswordConfirm(value);
      validatePasswordConfirm(value);
      return;
    }
  };

  const validateName = (value = name) => {
    if (value.length < 3) {
      setNameError('Name must be at least 3 characters.');
      return false;
    }
    return true;
  };

  const validateEmail = (value = email) => {
    if (!isEmail(value)) {
      setEmailError('The email field must be a valid email.');
      return false;
    }
    return true;
  };

  const validatePassword = (value = password) => {
    if (value.length < 6) {
      setPasswordError('The password field must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const validatePasswordConfirm = (value = passwordConfirm) => {
    if (value.length < 6) {
      setPasswordConfirmError(
        'The password field must be at least 6 characters.'
      );
      return false;
    }
    if (password !== value) {
      setPasswordConfirmError('Password confirmation does not match password.');
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    // If validation passes, submit.
    const nameValidates = validateName();
    const emailValidates = validateEmail();
    const passwordValidates = validatePassword();
    const passwordConfirmValidates = validatePasswordConfirm();

    if (
      nameValidates &&
      emailValidates &&
      passwordValidates &&
      passwordConfirmValidates
    ) {
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

  // Styles.
  const classes = useStyles();

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
                    error={nameError !== null}
                    helperText={nameError}
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
                    error={emailError !== null}
                    helperText={emailError}
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
                    error={passwordError !== null}
                    helperText={passwordError}
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
                    error={passwordConfirmError !== null}
                    helperText={passwordConfirmError}
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
                Already have an account? <Link to="/login">Log in</Link>.
              </Typography>
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

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAuthenticated: state.Auth.isAuthenticated
});

export default connect(mapStateToProps)(Register);
