import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import isEmail from "validator/es/lib/isEmail";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from "@material-ui/core";

import AuthService from "../services";

function LoginForm(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [response, setResponse] = useState({
    error: false,
    message: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      if (emailError) {
        setEmailError(null);
      }
      return;
    }

    if (name === "password") {
      setPassword(value);
      if (passwordError) {
        setPasswordError(null);
      }
      return;
    }
  };

  const handleBlur = e => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === "") {
      return;
    }

    if (name === "email") {
      setEmail(value);
      validateEmail(value);
      return;
    }

    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      return;
    }
  };

  const validateEmail = (value = email) => {
    if (!isEmail(value)) {
      setEmailError("The email field must be a valid email.");
      return false;
    }
    return true;
  };

  const validatePassword = (value = password) => {
    if (value.length < 6) {
      setPasswordError("The password field must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    // If validation passes, submit.
    const emailValidates = validateEmail();
    const passwordValidates = validatePassword();
    if (emailValidates && passwordValidates) {
      setLoading(true);
      submit({ email, password });
    }
  };

  const submit = credentials => {
    props.dispatch(AuthService.login(credentials)).catch(err => {
      const errors = Object.values(err.errors);
      errors.join(" ");
      const response = {
        error: true,
        message: errors
      };
      setResponse(response);
      setLoading(false);
      setEmail("");
      setPassword("");
    });
  };

  // Styles.
  const classes = useStyles();

  // If user is already authenticated we redirect to entry location.
  const { isAuthenticated } = props;
  if (isAuthenticated) {
    const { from } = props.location?.state || { from: { pathname: "/" } };
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
              <Typography align="center" variant="body2">
                Credentials were incorrect. Try again!
              </Typography>
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

const useStyles = makeStyles(() => ({
  loader: {
    color: "#fff"
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
