import {test} from '@jest/globals';
import validationServices from '../src/utils/validationServices';

import {
  groupCreation,
  resetCode,
  forgotPassword,
  signUpValidation3,
} from '../src/common/validationSchemas';

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

test('Group Creation Validation', () => {
  const groupData = {
    groupname: '354',
    radius: 70,
    passingpoints: 54,
    attendanceFrequency: 40,
    attendanceReward: -1,
    falseRequestPenalty: 22,
  };

  groupCreation.validate(groupData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('Reset Code Validation', () => {
  const resetData = {
    code: '4r43gf4',
  };

  resetCode.validate(resetData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('Reset Code Validation', () => {
  const resetData = {
    code: null,
  };

  resetCode.validate(resetData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('Reset Code Validation', () => {
  const resetData = {
    code: '56GGgd',
  };

  resetCode.validate(resetData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Correct input
test('Reset Code Validation', () => {
  const resetData = {
    code: '645533',
  };

  resetCode.validate(resetData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('Reset Code Validation', () => {
  const resetData = {
    code: '',
  };

  resetCode.validate(resetData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('Forgot Password Validation', () => {
  const PasswordData = {
    email: '',
  };

  forgotPassword.validate(PasswordData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Correct input
test('Forgot Password Validation', () => {
  const PasswordData = {
    email: 'sreeni@dal.ca',
  };

  forgotPassword.validate(PasswordData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('Forgot Password Validation', () => {
  const PasswordData = {
    email: 'aadil8475',
  };

  forgotPassword.validate(PasswordData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('SignUp Validation3', () => {
  const SignUp3Data = {
    password: 'aadil8475',
    confirmPassword: '456743456',
  };

  signUpValidation3.validate(SignUp3Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('SignUp Validation3', () => {
  const SignUp3Data = {
    password: 'aa',
    confirmPassword: '456',
  };

  signUpValidation3.validate(SignUp3Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('SignUp Validation3', () => {
  const SignUp3Data = {
    password: '456',
    confirmPassword: '456',
  };

  signUpValidation3.validate(SignUp3Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('SignUp Validation3', () => {
  const SignUp3Data = {
    password: '45yh332w6',
    confirmPassword: '45yh332w6',
  };

  signUpValidation3.validate(SignUp3Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});

//Incorrect input
test('SignUp Validation3', () => {
  const SignUp3Data = {
    password: '',
    confirmPassword: '',
  };

  signUpValidation3.validate(SignUp3Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
//Correct input
test('SignUp Validation3', () => {
  const SignUp3Data = {
    password: '45@h332W6',
    confirmPassword: '45@h332W6',
  };

  signUpValidation3.validate(SignUp3Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
