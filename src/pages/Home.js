import React from "react";
import { Typography, Grid, Box } from "@material-ui/core";

import LoginForm from "../components/LoginForm";

export default function Home() {
  return (
    <Grid container spacing={2} justify="center" alignItems="center">
      <Grid item xs={12} sm={6}>
        <Typography component="h2" variant="h3">
          Example Tasks App
        </Typography>
        <Box py={2} pr={4}>
          <Typography>
            Built with Material UI and scaffolded with Create React App. The
            project authenticates and stores data using an API built in Laravel.
          </Typography>
          <Typography>Source code and documentation on GitHub.</Typography>
        </Box>
      </Grid>
      <Grid item xs={12} sm={6}>
        <LoginForm />
      </Grid>
    </Grid>
  );
}
