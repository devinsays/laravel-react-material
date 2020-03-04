import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import AuthService from "../services";
import { validateEmail, validatePassword } from "../utils/validation.js";

function LoginForm(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState({
    value: "",
    error: false
  });
  const [password, setPassword] = useState({
    value: "",
    error: false
  });
  const [response, setResponse] = useState({
    error: false,
    message: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail({ value, error: false });
      return;
    }

    if (name === "password") {
      setPassword({ value, error: false });
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
      setEmail({ value, error: validateEmail(value) });
      return;
    }

    if (name === "password") {
      setPassword({ value, error: validatePassword(value) });
      return;
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (email.error === false && password.error === false) {
      setLoading(true);
      submit({ email: email.value, password: password.value });
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
      setEmail({ value: "", error: false });
      setPassword({ value: "", error: false });
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
                  error={email.error !== false}
                  helperText={email.error}
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
                  error={password.error !== false}
                  helperText={password.error}
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
