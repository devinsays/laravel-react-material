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

// Checks all the values in the validationErrors object.
// Returns true if there are no errors (i.e each value is false).
export const formValidates = validationErrors => {
  return Object.values(validationErrors).every(value => value === false);
};
