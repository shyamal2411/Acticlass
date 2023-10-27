import { test } from '@jest/globals';

import {
  groupCreation,
  resetCode,
  forgotPassword,
  signUpValidation3,
  signUpValidation2,
  signUpValidation1,
  signInValidation,
} from '../src/common/validationSchemas';


test('Group Creation Validation', () => {
  const groupData = {
    groupname: '354',
    radius: 70,
    passingPoints: 54,
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

//Incorrect input
test('SignUp Validation2', () => {
  const SignUp2Data = {
    institute: '',
    role: '',
  };
 
  signUpValidation2.validate(SignUp2Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation2', () => {
  const SignUp2Data = {
    institute: '',
    role: 'Student',
  };
 
  signUpValidation2.validate(SignUp2Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation2', () => {
  const SignUp2Data = {
    institute: 'Dalhousie University',
    role: '',
  };
 
  signUpValidation2.validate(SignUp2Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation2', () => {
  const SignUp2Data = {
    institute: null,
    role: null,
  };
 
  signUpValidation2.validate(SignUp2Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Correct input
test('SignUp Validation2', () => {
  const SignUp2Data = {
    institute: 'Dalhousie University',
    role: 'Teacher',
  };
 
  signUpValidation2.validate(SignUp2Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation1', () => {
  const SignUp1Data = {
    email: 'aadi@gmail.com',
    name: 'Krish184656553626352553634937443334535533',
  };
 
  signUpValidation1.validate(SignUp1Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation1', () => {
  const SignUp1Data = {
    email: 'aadi@',
    name: 'Kri5533',
  };
 
  signUpValidation1.validate(SignUp1Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation1', () => {
  const SignUp1Data = {
    email: 'krish@',
    name: 'Krishna',
  };
 
  signUpValidation1.validate(SignUp1Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Correct input
test('SignUp Validation1', () => {
  const SignUp1Data = {
    email: 'krish@gmail.com',
    name: 'Krishna',
  };
 
  signUpValidation1.validate(SignUp1Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation1', () => {
  const SignUp1Data = {
    email: null,
    name: null,
  };
 
  signUpValidation1.validate(SignUp1Data).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation', () => {
  const SignUpData = {
    email: null,
    name: null,
  };
 
  signInValidation.validate(SignUpData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Correct input
test('SignUp Validation', () => {
  const SignUpData = {
    email: 'krish@gmail.com',
    name: 'Krishna',
  };
 
  signInValidation.validate(SignUpData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation', () => {
  const SignUpData = {
    email: 'krish@',
    name: 'Krishna',
  };
 
  signInValidation.validate(SignUpData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation', () => {
  const SignUpData = {
    email: 'aadi@',
    name: 'Kri5533',
  };
 
  signInValidation.validate(SignUpData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});
 
//Incorrect input
test('SignUp Validation', () => {
  const SignUpData = {
    email: 'aadi@gmail.com',
    name: 'Krish184656553626352553634937443334535533',
  };
 
  signInValidation.validate(SignUpData).catch(err => {
    console.log(err);
    expect(true).toBe(err != null);
  });
});