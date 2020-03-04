import isEmail from "validator/es/lib/isEmail";

export const validateEmail = value => {
  if (!isEmail(value)) {
    return "The email field must be a valid email.";
  }
  return false;
};

export const validatePassword = value => {
  if (value.length < 6) {
    return "The password field must be at least 6 characters.";
  }
  return false;
};
