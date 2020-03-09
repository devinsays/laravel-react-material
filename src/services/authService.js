import http from '../http';
import * as action from '../store/actions';
import { apiBase } from '../config';

export function login(credentials) {
  return dispatch =>
    new Promise((resolve, reject) => {
      http
        .post(`${apiBase}/api/v1/auth/login`, credentials)
        .then(res => {
          dispatch(action.authLogin(res.data));
          return resolve();
        })
        .catch(err => {
          const { status, errors } = err.response.data;
          const data = {
            status,
            errors: errors ? errors : ['Unknown error.']
          };
          return reject(data);
        });
    });
}

export function register(credentials) {
  return dispatch =>
    new Promise((resolve, reject) => {
      http
        .post(`${apiBase}/api/v1/auth/register`, credentials)
        .then(res => resolve(res.data))
        .catch(err => {
          const { status, errors } = err.response.data;
          const data = {
            status,
            errors
          };
          return reject(data);
        });
    });
}

export function resetPassword(credentials) {
  return dispatch =>
    new Promise((resolve, reject) => {
      http
        .post(`${apiBase}/api/v1/auth/forgot-password`, credentials)
        .then(res => resolve(res.data))
        .catch(err => {
          const { status, errors } = err.response.data;
          const data = {
            status,
            errors
          };
          return reject(data);
        });
    });
}

export function updatePassword(credentials) {
  return dispatch =>
    new Promise((resolve, reject) => {
      http
        .post(`${apiBase}/api/v1/auth/password-reset`, credentials)
        .then(res => {
          const { status } = res.data.status;
          if (status === 202) {
            const data = {
              error: res.data.message,
              status
            };
            return reject(data);
          }
          return resolve(res);
        })
        .catch(err => {
          const { status, errors } = err.response.data;
          const data = {
            status,
            errors
          };
          return reject(data);
        });
    });
}
