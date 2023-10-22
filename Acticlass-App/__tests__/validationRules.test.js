import {test} from '@jest/globals';
import validationServices from '../src/utils/validationServices';

test('Email Validation', () => {
  const email = 'sgp@dal.ca';
  expect(validationServices.validateEmail(email)).toBe(true);
});

test('Phone Validation', () => {
  const phone = '9021234567';
  expect(validationServices.validatePhone(phone)).toBe(true);
});

test('Password Validation', () => {
  const password = 'Password123!';
  expect(validationServices.validatePassword(password)).toBe(true);
});
