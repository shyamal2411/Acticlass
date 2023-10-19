import * as Yup from 'yup';

// SignIn validation schema
export const signInValidation = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

// Signup validation schema
export const signUpValidation1 = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  name: Yup.string()
    .max(15, 'Too Long!')
    .matches(/^[A-Za-z]+$/, 'Whitespace and Number are not allowed!')
    .required('Required'),
});

export const signUpValidation2 = Yup.object().shape({
  institute: Yup.string().required('Required'),
  role: Yup.string().required('Required'),
});

export const signUpValidation3 = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

// Forgot password validation schema
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

// Reset password validation schema
export const resetCodeSchema = Yup.object().shape({
  code: Yup.string()
    .matches(/^[0-9]{6}$/, 'Must be 6 digit code')
    .required('Required'),
});

// Group Name Validation Schema
export const groupName = Yup.object().shape({
  groupname: Yup.string().required('Required'),
});

// Class Radius Validation Schema
export const classRadiusValidation = Yup.object().shape({
  radius: Yup.number().min(5).max(100).required('Required'),
});

// Passing Points Validation Schema
export const passingPointsValidation = Yup.object().shape({
  passingpoints: Yup.number().min(0).max(100).required('Required'),
});

// Attendance Frequency Validation Schema
export const attendanceFrequenceValidation = Yup.object().shape({
  attendanceFrequencyValidation: Yup.number().required('Required'),
});

// Attendance Reward Validation Schema
export const attendanceRewardValidation = Yup.object().shape({
  attendanceRewardValidation: Yup.number().min(0).max(100).required('Required'),
});

// Attendance Frequency Validation Schema
export const falseRequestPenalty = Yup.object().shape({
  falseRequestPenaltyValidation: Yup.number()
    .min(0)
    .max(100)
    .required('Required'),
});
