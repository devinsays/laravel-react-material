import React from 'react';
import { Container } from '@material-ui/core';

import LoginForm from '../components/LoginForm';

export default function Login() {
  return (
    <Container maxWidth="sm">
      <LoginForm />
    </Container>
  );
}
