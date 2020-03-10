import React from 'react';
import { Typography, Grid, Box } from '@material-ui/core';

import LoginForm from '../components/LoginForm';

export default function Home() {
  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item xs={12} sm={6}>
        <Typography component="h2" variant="h3">
          Example To Do App
        </Typography>
        <Box py={2} pr={4}>
          <Typography>
            This headless frontend was built with{' '}
            <a href="https://material-ui.com/">Material UI</a> and scaffolded
            with{' '}
            <a href="https://reactjs.org/docs/create-a-new-react-app.html">
              Create React App
            </a>
            . The project authenticates and stores data using{' '}
            <a href="https://github.com/devinsays/laravel-react-bootstrap">
              an API built in Laravel
            </a>
            .
          </Typography>
          <Typography>
            <a href="https://github.com/devinsays/laravel-react-material">
              Source code and documentation on GitHub.
            </a>
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LoginForm />
      </Grid>
    </Grid>
  );
}
