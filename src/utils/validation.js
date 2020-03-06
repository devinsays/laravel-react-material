import isEmail from 'validator/es/lib/isEmail';

export const emailValidationError = value => {
  if (!isEmail(value)) {
    return 'The email field must be a valid email.';
  }
  return false;
};

export const passwordValidationError = value => {
  if (value.length < 6) {
    return 'The password field must be at least 6 characters.';
  }
  return false;
};
