import React from 'react';
import { Helmet } from 'react-helmet';
import { Container } from '@material-ui/core';

import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <>
      <Helmet>
        <title>Log In | Laravel Material</title>
      </Helmet>
      <Container maxWidth="sm">
        <LoginForm />
      </Container>
    </>
  );
}
