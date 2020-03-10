import isEmail from 'validator/es/lib/isEmail';

export const nameValidationError = value => {
  if (value.length < 3) {
    return 'Name must be at least 3 characters.';
  }
  return false;
};

export const emailValidationError = (value = '') => {
  if (!isEmail(value)) {
    return 'The email field must be a valid email.';
  }
  return false;
};

export const passwordValidationError = (value = '') => {
  if (value.length < 6) {
    return 'The password field must be at least 6 characters.';
  }
  return false;
};

export const passwordConfirmValidationError = (value = '', password = '') => {
  if (value.length < 6) {
    return 'The password field must be at least 6 characters.';
  }
  if (password !== value) {
    return 'Password confirmation does not match password.';
  }
  return false;
};
