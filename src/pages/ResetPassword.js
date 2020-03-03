import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";

import AuthService from "../services";

function ForgotPassword(props) {
  // State hooks.
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState(null);
  const [response, setResponse] = useState({
    error: false,
    message: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;

    if (name === "password") {
      setPassword(value);
      if (passwordError) {
        setPasswordError(null);
      }
      return;
    }

    if (name === "passwordConfirm") {
      setPasswordConfirm(value);
      if (passwordConfirmError) {
        setPasswordConfirmError(null);
      }
      return;
    }

    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      return;
    }

    if (name === "passwordConfirm") {
      setPasswordConfirm(value);
      validatePasswordConfirm(value);
      return;
    }
  };

  const handleBlur = e => {
    const { name, value } = e.target;

    // Avoid validation until input has a value.
    if (value === "") {
      return;
    }

    if (name === "password") {
      setPassword(value);
      validatePassword(value);
      return;
    }

    if (name === "passwordConfirm") {
      setPasswordConfirm(value);
      validatePasswordConfirm(value);
      return;
    }
  };

  const validatePassword = (value = password) => {
    if (value.length < 6) {
      setPasswordError("The password field must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const validatePasswordConfirm = (value = passwordConfirm) => {
    if (value.length < 6) {
      setPasswordConfirmError(
        "The password field must be at least 6 characters."
      );
      return false;
    }
    if (password !== value) {
      setPasswordConfirmError("Password confirmation does not match password.");
    }
    return true;
  };

  const handleSubmit = e => {
    e.preventDefault();

    // If validation passes, submit.
    const passwordValidates = validatePassword();
    const passwordConfirmValidates = validatePasswordConfirm();

    if (passwordValidates && passwordConfirmValidates) {
      setLoading(true);
      submit({
        password,
        password_confirmation: passwordConfirm
      });
    }
  };

  const getResetId = () => {
    const params = new URLSearchParams(props.location.search);
    if (params.has("id")) {
      return params.get("id");
    }
    return "";
  };

  const getResetToken = () => {
    const params = new URLSearchParams(props.location.search);
    if (params.has("token")) {
      return params.get("token");
    }
    return "";
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
        errors.join(" ");
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
    color: "#fff"
  }
}));

ForgotPassword.defaultProps = {
  location: {
    state: {
      pathname: "/"
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
